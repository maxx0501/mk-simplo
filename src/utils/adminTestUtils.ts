
import { supabase } from '@/integrations/supabase/client';

export const createTestStores = async () => {
  console.log('🧪 Criando lojas de teste no banco...');
  
  // UUID fixo para testes (você pode usar qualquer UUID válido para testes)
  const testUserId = '550e8400-e29b-41d4-a716-446655440000';
  
  const testStores = [
    {
      name: 'Loja Tech Solutions',
      owner_name: 'João Pedro Silva',
      email: 'joao@techsolutions.com',
      plan_type: 'pro',
      status: 'active',
      phone: '(11) 99999-1234',
      cnpj: '12.345.678/0001-90',
      user_id: testUserId
    },
    {
      name: 'Boutique Fashion Style',
      owner_name: 'Maria Fernanda Costa',
      email: 'maria@fashionstyle.com',
      plan_type: 'premium',
      status: 'active',
      phone: '(11) 88888-5678',
      user_id: testUserId
    },
    {
      name: 'Padaria do Bairro',
      owner_name: 'Carlos Roberto Santos',
      email: 'carlos@padariabairro.com',
      plan_type: 'basic',
      status: 'active',
      phone: '(11) 77777-9012',
      user_id: testUserId
    },
    {
      name: 'Farmácia Vida Saudável',
      owner_name: 'Ana Paula Lima',
      email: 'ana@vidasaudavel.com',
      plan_type: 'free',
      status: 'active',
      phone: '(11) 66666-3456',
      user_id: testUserId
    }
  ];

  try {
    const { data, error } = await supabase
      .from('stores')
      .insert(testStores)
      .select();

    if (error) {
      console.error('❌ Erro ao criar lojas de teste:', error);
      return { success: false, error };
    }

    console.log('✅ Lojas de teste criadas:', data?.length);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro inesperado ao criar lojas:', error);
    return { success: false, error };
  }
};
