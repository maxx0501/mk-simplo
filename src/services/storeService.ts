
import { supabase } from '@/integrations/supabase/client';

export const createNewStore = async (storeName: string, phone?: string, cnpj?: string, storeType?: string) => {
  console.log('=== INICIANDO CRIAÇÃO DA LOJA ===');
  console.log('Nome da loja:', storeName);
  
  // Verificar sessão do usuário de forma mais robusta
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Erro ao obter sessão:', sessionError);
    throw new Error('Problema na sessão do usuário. Faça login novamente.');
  }

  if (!sessionData.session?.user) {
    console.error('Usuário não autenticado - sem sessão');
    throw new Error('Usuário não autenticado. Faça login novamente.');
  }

  const user = sessionData.session.user;
  console.log('Usuário da sessão:', user.id, user.email);

  // Verificar se o usuário já tem uma loja
  console.log('Verificando se usuário já tem loja...');
  const { data: existingStore, error: checkError } = await supabase
    .from('user_stores')
    .select('store_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (checkError) {
    console.error('Erro ao verificar loja existente:', checkError);
  }

  if (existingStore) {
    console.log('Usuário já tem loja:', existingStore.store_id);
    throw new Error('Você já possui uma loja cadastrada.');
  }

  // Verificar/criar perfil do usuário
  console.log('Verificando perfil do usuário...');
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Se não tem perfil, criar um
  if (!profileData) {
    console.log('Criando perfil para o usuário...');
    const { error: createProfileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
        is_superadmin: false
      });

    if (createProfileError) {
      console.error('Erro ao criar perfil:', createProfileError);
      // Não bloquear a criação da loja por isso
    }
  }

  // Criar a loja com dados básicos - SEMPRE começar com dados limpos
  console.log('Criando loja na tabela stores...');
  console.log('Dados da loja:', {
    name: storeName.trim(),
    email: user.email || '',
    owner_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Proprietário',
    user_id: user.id,
    plan_type: 'free',
    subscription_status: 'trial',
    status: 'active'
  });

  const { data: storeData, error: storeError } = await supabase
    .from('stores')
    .insert({
      name: storeName.trim(),
      email: user.email || '',
      phone: phone || null,
      cnpj: cnpj || null,
      owner_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Proprietário',
      plan_type: 'free',
      status: 'active',
      subscription_status: 'trial',
      trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      user_id: user.id
    })
    .select()
    .single();

  if (storeError) {
    console.error('Erro detalhado ao criar loja:', {
      code: storeError.code,
      message: storeError.message,
      details: storeError.details,
      hint: storeError.hint
    });
    
    throw new Error(`Erro: ${storeError.message}. Entre em contato com o suporte se o problema persistir.`);
  }

  console.log('Loja criada com sucesso:', storeData);

  // Associar usuário à loja
  console.log('Criando associação user_stores...');
  const { error: userStoreError } = await supabase
    .from('user_stores')
    .insert({
      user_id: user.id,
      store_id: storeData.id,
      role: 'owner'
    });

  if (userStoreError) {
    console.error('Erro ao associar usuário à loja:', userStoreError);
    
    // Rollback: deletar a loja criada
    await supabase.from('stores').delete().eq('id', storeData.id);
    
    throw new Error('Não foi possível associar a loja ao usuário.');
  }

  console.log('Associação criada com sucesso');
  console.log('🧼 Nova loja criada SEM dados pré-populados - sistema totalmente limpo');

  // Retornar dados da loja criada
  return {
    success: true,
    storeData: {
      id: storeData.id,
      name: storeData.name,
      email: storeData.email,
      owner_name: storeData.owner_name
    },
    userData: {
      id: user.id,
      email: user.email,
      role: 'owner',
      store_id: storeData.id,
      store_name: storeData.name
    }
  };
};
