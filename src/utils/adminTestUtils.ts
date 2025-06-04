
import { supabase } from '@/integrations/supabase/client';

export const createTestStores = async () => {
  console.log('🧪 Criando lojas de teste no banco...');
  
  const testStores = [
    {
      name: 'Loja Tech Solutions',
      owner_name: 'João Pedro Silva',
      email: 'joao@techsolutions.com',
      plan_type: 'pro',
      status: 'active',
      phone: '(11) 99999-1234',
      cnpj: '12.345.678/0001-90'
    },
    {
      name: 'Boutique Fashion Style',
      owner_name: 'Maria Fernanda Costa',
      email: 'maria@fashionstyle.com',
      plan_type: 'premium',
      status: 'active',
      phone: '(11) 88888-5678'
    },
    {
      name: 'Padaria do Bairro',
      owner_name: 'Carlos Roberto Santos',
      email: 'carlos@padariabairro.com',
      plan_type: 'basic',
      status: 'active',
      phone: '(11) 77777-9012'
    },
    {
      name: 'Farmácia Vida Saudável',
      owner_name: 'Ana Paula Lima',
      email: 'ana@vidasaudavel.com',
      plan_type: 'free',
      status: 'active',
      phone: '(11) 66666-3456'
    },
    {
      name: 'Oficina do João',
      owner_name: 'João Mecânico Silva',
      email: 'joao@oficina.com',
      plan_type: 'basic',
      status: 'active',
      phone: '(11) 55555-7890'
    }
  ];

  try {
    console.log('📝 Inserindo lojas na tabela stores...');
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
