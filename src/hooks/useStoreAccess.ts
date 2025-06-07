
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStoreAccess = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const joinStoreById = async (storeId: string) => {
    if (!storeId) {
      toast({
        title: "ID da loja obrigatório",
        description: "Digite o ID da loja para continuar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        toast({
          title: "Usuário não autenticado",
          description: "Faça login novamente",
          variant: "destructive"
        });
        return;
      }

      // Verificar se a loja existe
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

      if (storeError || !store) {
        toast({
          title: "Loja não encontrada",
          description: "Verifique o ID da loja e tente novamente",
          variant: "destructive"
        });
        return;
      }

      // Verificar se já está na loja
      const { data: existingRelation } = await supabase
        .from('user_stores')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('store_id', storeId)
        .single();

      if (existingRelation) {
        // Atualizar dados do usuário
        const userData = {
          id: authUser.id,
          email: authUser.email,
          role: existingRelation.role,
          store_id: store.id,
          store_name: store.name
        };

        localStorage.setItem('mksimplo_user', JSON.stringify(userData));
        
        toast({
          title: "Bem-vindo de volta!",
          description: `Conectado à loja: ${store.name}`
        });

        navigate('/dashboard');
        return;
      }

      // Adicionar usuário à loja
      const { error: relationError } = await supabase
        .from('user_stores')
        .insert({
          user_id: authUser.id,
          store_id: storeId,
          role: 'member'
        });

      if (relationError) {
        console.error('Erro ao adicionar à loja:', relationError);
        toast({
          title: "Erro ao conectar à loja",
          description: "Tente novamente mais tarde",
          variant: "destructive"
        });
        return;
      }

      // Atualizar dados do usuário
      const userData = {
        id: authUser.id,
        email: authUser.email,
        role: 'member',
        store_id: store.id,
        store_name: store.name
      };

      localStorage.setItem('mksimplo_user', JSON.stringify(userData));
      
      toast({
        title: "Conectado à loja!",
        description: `Bem-vindo à loja: ${store.name}`
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    joinStoreById,
    loading
  };
};
