
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useStoreAccess = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const joinStore = async (accessCode: string) => {
    setLoading(true);
    
    try {
      console.log('🔑 Tentando acessar loja com código:', accessCode);

      // Verificar sessão do usuário
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session?.user) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      const user = sessionData.session.user;

      // Buscar loja pelo código de acesso
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('access_code', accessCode.toUpperCase())
        .maybeSingle();

      if (storeError) {
        console.error('Erro ao buscar loja:', storeError);
        throw new Error('Erro ao verificar código de acesso.');
      }

      if (!storeData) {
        throw new Error('Código de acesso inválido. Verifique o código e tente novamente.');
      }

      // Verificar se o usuário já está associado a esta loja
      const { data: existingAssociation } = await (supabase as any)
        .from('user_stores')
        .select('*')
        .eq('user_id', user.id)
        .eq('store_id', storeData.id)
        .maybeSingle();

      if (existingAssociation) {
        // Usuário já está associado, apenas atualizar localStorage
        const userData = {
          id: user.id,
          email: user.email,
          role: existingAssociation.role,
          store_id: storeData.id,
          store_name: storeData.name
        };

        localStorage.setItem('mksimplo_user', JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));

        toast({
          title: "Acesso realizado!",
          description: `Bem-vindo de volta à ${storeData.name}!`
        });

        return true;
      }

      // Criar nova associação como funcionário
      const { error: associationError } = await (supabase as any)
        .from('user_stores')
        .insert({
          user_id: user.id,
          store_id: storeData.id,
          role: 'employee'
        });

      if (associationError) {
        console.error('Erro ao associar usuário à loja:', associationError);
        throw new Error('Erro ao associar usuário à loja.');
      }

      // Atualizar localStorage
      const userData = {
        id: user.id,
        email: user.email,
        role: 'employee',
        store_id: storeData.id,
        store_name: storeData.name
      };

      localStorage.setItem('mksimplo_user', JSON.stringify(userData));
      window.dispatchEvent(new Event('storage'));

      toast({
        title: "Acesso realizado com sucesso!",
        description: `Você agora faz parte da equipe da ${storeData.name}!`
      });

      console.log('✅ Usuário associado à loja com sucesso');
      return true;

    } catch (error: any) {
      console.error('❌ Erro ao acessar loja:', error);
      
      toast({
        title: "Erro ao acessar loja",
        description: error.message || "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { joinStore, loading };
};
