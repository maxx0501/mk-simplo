
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

  // Criar perfil do usuário se necessário
  console.log('Criando perfil do usuário se necessário...');
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'
      });

    if (profileError && profileError.code !== '23505') { // 23505 = unique constraint violation (já existe)
      console.log('⚠️ Erro ao criar perfil:', profileError);
    }
  } catch (profileError) {
    console.log('⚠️ Erro ao criar perfil, continuando:', profileError);
    // Não bloquear a criação da loja por isso
  }

  // Gerar código de acesso único para a loja
  const { data: accessCodeData } = await supabase.rpc('generate_store_access_code');
  const accessCode = accessCodeData || 'TEMP' + Math.random().toString(36).substr(2, 4).toUpperCase();

  // Criar a loja com dados obrigatórios corretamente preenchidos
  console.log('Criando loja na tabela stores...');
  const storeData = {
    name: storeName.trim(),
    email: user.email || '',
    phone: phone || null,
    cnpj: cnpj || null,
    owner_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Proprietário',
    plan_type: 'free', // Garantir que seja preenchido
    status: 'active', // Garantir que seja preenchido
    subscription_status: 'trial', // Garantir que seja preenchido
    trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: user.id,
    access_code: accessCode
  };

  console.log('Dados da loja a serem inseridos:', storeData);

  const { data: newStoreData, error: storeError } = await supabase
    .from('stores')
    .insert(storeData)
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

  console.log('Loja criada com sucesso:', newStoreData);

  // Associar usuário à loja
  console.log('Criando associação user_stores...');
  const { error: userStoreError } = await supabase
    .from('user_stores')
    .insert({
      user_id: user.id,
      store_id: newStoreData.id,
      role: 'owner'
    });

  if (userStoreError) {
    console.error('Erro ao associar usuário à loja:', userStoreError);
    
    // Rollback: deletar a loja criada
    await supabase.from('stores').delete().eq('id', newStoreData.id);
    
    throw new Error('Não foi possível associar a loja ao usuário.');
  }

  console.log('Associação criada com sucesso');
  console.log('✅ Nova loja criada com ID:', accessCode);

  // Retornar dados da loja criada
  return {
    success: true,
    storeData: {
      id: newStoreData.id,
      name: newStoreData.name,
      email: newStoreData.email,
      owner_name: newStoreData.owner_name,
      access_code: newStoreData.access_code
    },
    userData: {
      id: user.id,
      email: user.email,
      role: 'owner',
      store_id: newStoreData.id,
      store_name: newStoreData.name
    }
  };
};
