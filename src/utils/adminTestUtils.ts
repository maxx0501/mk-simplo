
import { supabase } from '@/integrations/supabase/client';

export const createTestStores = async () => {
  console.log('🧪 Criando lojas de teste no banco...');
  
  try {
    // Verificar se o usuário está autenticado
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      console.error('❌ Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    const adminUserId = sessionData.session.user.id;
    console.log('👤 Admin ID:', adminUserId);

    // Verificar se é admin
    const { data: adminData, error: adminError } = await supabase
      .from('platform_admins')
      .select('*')
      .eq('user_id', adminUserId)
      .maybeSingle();

    if (adminError) {
      console.error('❌ Erro ao verificar admin:', adminError);
      return { success: false, error: adminError.message };
    }

    if (!adminData) {
      console.log('🔧 Criando entrada de admin...');
      
      const { error: createAdminError } = await supabase
        .from('platform_admins')
        .insert({
          user_id: adminUserId,
          email: sessionData.session.user.email || 'admin@test.com'
        });

      if (createAdminError) {
        console.error('❌ Erro ao criar admin:', createAdminError);
        return { success: false, error: createAdminError.message };
      }
      
      console.log('✅ Admin criado com sucesso');
    }

    // Dados das lojas de teste
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
      }
    ];

    console.log('📝 Inserindo lojas na tabela stores...');
    
    const { data: storesData, error: storesError } = await supabase
      .from('stores')
      .insert(testStores)
      .select();

    if (storesError) {
      console.error('❌ Erro ao criar lojas de teste:', storesError);
      return { success: false, error: storesError.message };
    }

    console.log('✅ Lojas criadas com sucesso:', storesData?.length);
    return { success: true, data: storesData };
    
  } catch (error: any) {
    console.error('❌ Erro inesperado ao criar lojas:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
};
