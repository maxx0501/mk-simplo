
import { supabase } from '@/integrations/supabase/client';

export const createTestStores = async () => {
  console.log('🧪 Criando lojas de teste no banco...');
  
  // Primeiro, vamos obter o ID do usuário atual (admin)
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session?.user) {
    console.error('❌ Usuário não autenticado');
    return { success: false, error: 'Usuário não autenticado' };
  }

  const adminUserId = sessionData.session.user.id;
  
  const testStores = [
    {
      name: 'Loja Tech Solutions',
      owner_name: 'João Pedro Silva',
      email: 'joao@techsolutions.com',
      plan_type: 'pro',
      status: 'active',
      phone: '(11) 99999-1234',
      cnpj: '12.345.678/0001-90',
      user_id: adminUserId
    },
    {
      name: 'Boutique Fashion Style',
      owner_name: 'Maria Fernanda Costa',
      email: 'maria@fashionstyle.com',
      plan_type: 'premium',
      status: 'active',
      phone: '(11) 88888-5678',
      user_id: adminUserId
    },
    {
      name: 'Padaria do Bairro',
      owner_name: 'Carlos Roberto Santos',
      email: 'carlos@padariabairro.com',
      plan_type: 'basic',
      status: 'active',
      phone: '(11) 77777-9012',
      user_id: adminUserId
    },
    {
      name: 'Farmácia Vida Saudável',
      owner_name: 'Ana Paula Lima',
      email: 'ana@vidasaudavel.com',
      plan_type: 'free',
      status: 'active',
      phone: '(11) 66666-3456',
      user_id: adminUserId
    },
    {
      name: 'Oficina do João',
      owner_name: 'João Mecânico Silva',
      email: 'joao@oficina.com',
      plan_type: 'basic',
      status: 'active',
      phone: '(11) 55555-7890',
      user_id: adminUserId
    }
  ];

  try {
    console.log('📝 Inserindo lojas na tabela stores...');
    
    // Primeiro, vamos verificar se o usuário é admin
    const { data: adminData, error: adminError } = await supabase
      .from('platform_admins')
      .select('*')
      .eq('user_id', adminUserId)
      .maybeSingle();

    if (adminError) {
      console.error('❌ Erro ao verificar admin:', adminError);
      return { success: false, error: adminError };
    }

    if (!adminData) {
      console.log('🔧 Usuário não é admin, criando entrada de admin...');
      
      // Criar entrada de admin para o usuário atual
      const { error: createAdminError } = await supabase
        .from('platform_admins')
        .insert({
          user_id: adminUserId,
          email: sessionData.session.user.email || 'admin@test.com'
        });

      if (createAdminError) {
        console.error('❌ Erro ao criar admin:', createAdminError);
        return { success: false, error: createAdminError };
      }
      
      console.log('✅ Admin criado com sucesso');
    }

    const { data: storesData, error: storesError } = await supabase
      .from('stores')
      .insert(testStores)
      .select();

    if (storesError) {
      console.error('❌ Erro ao criar lojas de teste:', storesError);
      return { success: false, error: storesError };
    }

    console.log('✅ Lojas criadas com sucesso:', storesData?.length);
    return { success: true, data: storesData };
  } catch (error) {
    console.error('❌ Erro inesperado ao criar lojas:', error);
    return { success: false, error };
  }
};
