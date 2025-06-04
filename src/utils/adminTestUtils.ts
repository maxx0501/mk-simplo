
import { supabase } from '@/integrations/supabase/client';

// Dados de lojas de exemplo para demonstração
const DEMO_STORES = [
  {
    id: 'demo-store-1',
    name: 'Loja Tech Solutions',
    owner_name: 'João Pedro Silva',
    email: 'joao@techsolutions.com',
    plan_type: 'pro',
    status: 'active',
    phone: '(11) 99999-1234',
    cnpj: '12.345.678/0001-90',
    created_at: '2024-01-15T10:30:00Z',
    user_id: 'demo-admin-id'
  },
  {
    id: 'demo-store-2',
    name: 'Boutique Fashion Style',
    owner_name: 'Maria Fernanda Costa',
    email: 'maria@fashionstyle.com',
    plan_type: 'premium',
    status: 'active',
    phone: '(11) 88888-5678',
    created_at: '2024-01-20T14:15:00Z',
    user_id: 'demo-admin-id'
  },
  {
    id: 'demo-store-3',
    name: 'Padaria do Bairro',
    owner_name: 'Carlos Roberto Santos',
    email: 'carlos@padariabairro.com',
    plan_type: 'basic',
    status: 'active',
    phone: '(11) 77777-9012',
    created_at: '2024-01-25T09:45:00Z',
    user_id: 'demo-admin-id'
  },
  {
    id: 'demo-store-4',
    name: 'Eletrônicos Central',
    owner_name: 'Ana Paula Oliveira',
    email: 'ana@eletronicosc.com',
    plan_type: 'pro',
    status: 'active',
    phone: '(11) 66666-3456',
    created_at: '2024-02-01T16:20:00Z',
    user_id: 'demo-admin-id'
  },
  {
    id: 'demo-store-5',
    name: 'Farmácia Saúde Mais',
    owner_name: 'Dr. Roberto Mendes',
    email: 'roberto@saudemais.com',
    plan_type: 'premium',
    status: 'active',
    phone: '(11) 55555-7890',
    created_at: '2024-02-05T11:10:00Z',
    user_id: 'demo-admin-id'
  }
];

export const createTestStores = async () => {
  console.log('🧪 Criando lojas de teste...');
  
  try {
    // Verificar se é usuário demo
    const userData = localStorage.getItem('mksimplo_user');
    if (!userData) {
      console.error('❌ Usuário não encontrado');
      return { success: false, error: 'Usuário não encontrado' };
    }

    const user = JSON.parse(userData);
    console.log('👤 Usuário:', user.email);

    // Se for usuário demo, retornar dados de exemplo
    if (user.isDemo && user.email === 'admin@mksimplo.com') {
      console.log('✅ Retornando lojas de demonstração para usuário demo');
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        data: DEMO_STORES,
        isDemoData: true
      };
    }

    // Para usuários reais, tentar criar no banco
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session?.user) {
      console.error('❌ Usuário real não autenticado no Supabase');
      return { success: false, error: 'Usuário não autenticado no Supabase' };
    }

    const adminUserId = sessionData.session.user.id;
    console.log('👤 Admin real ID:', adminUserId);

    // Verificar/criar admin
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
          email: sessionData.session.user.email || 'admin@real.com'
        });

      if (createAdminError) {
        console.error('❌ Erro ao criar admin:', createAdminError);
        return { success: false, error: createAdminError.message };
      }
      
      console.log('✅ Admin criado com sucesso');
    }

    // Criar lojas reais no banco
    const testStores = [
      {
        name: 'Loja Tech Solutions Real',
        owner_name: 'João Pedro Silva',
        email: 'joao@techsolutions-real.com',
        plan_type: 'pro',
        status: 'active',
        phone: '(11) 99999-1234',
        cnpj: '12.345.678/0001-90',
        user_id: adminUserId
      },
      {
        name: 'Boutique Fashion Real',
        owner_name: 'Maria Fernanda Costa',
        email: 'maria@fashion-real.com',
        plan_type: 'premium',
        status: 'active',
        phone: '(11) 88888-5678',
        user_id: adminUserId
      },
      {
        name: 'Padaria Real',
        owner_name: 'Carlos Roberto Santos',
        email: 'carlos@padaria-real.com',
        plan_type: 'basic',
        status: 'active',
        phone: '(11) 77777-9012',
        user_id: adminUserId
      }
    ];

    console.log('📝 Inserindo lojas reais na tabela stores...');
    
    const { data: storesData, error: storesError } = await supabase
      .from('stores')
      .insert(testStores)
      .select();

    if (storesError) {
      console.error('❌ Erro ao criar lojas reais:', storesError);
      return { success: false, error: storesError.message };
    }

    console.log('✅ Lojas reais criadas com sucesso:', storesData?.length);
    return { success: true, data: storesData, isDemoData: false };
    
  } catch (error: any) {
    console.error('❌ Erro inesperado ao criar lojas:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
};

export const loadStoresForAdmin = async () => {
  try {
    // Verificar se é usuário demo
    const userData = localStorage.getItem('mksimplo_user');
    if (!userData) {
      console.error('❌ Usuário não encontrado');
      return { success: false, data: [] };
    }

    const user = JSON.parse(userData);
    console.log('🔍 Carregando lojas para:', user.email);

    // Se for usuário demo, retornar dados de exemplo
    if (user.isDemo && user.email === 'admin@mksimplo.com') {
      console.log('✅ Retornando lojas de demonstração');
      return { 
        success: true, 
        data: DEMO_STORES,
        isDemoData: true
      };
    }

    // Para usuários reais, buscar no banco
    const { data: storesData, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro na consulta:', error);
      return { success: false, data: [] };
    }

    console.log('📊 Lojas reais encontradas:', storesData?.length || 0);
    return { 
      success: true, 
      data: storesData || [],
      isDemoData: false
    };
    
  } catch (error: any) {
    console.error('❌ Erro inesperado:', error);
    return { success: false, data: [] };
  }
};
