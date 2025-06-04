
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);

    try {
      console.log('Tentando fazer login com email:', email);

      // Admin demo check
      if (email === 'admin@mksimplo.com') {
        console.log('Login de admin demo');
        localStorage.setItem('mksimplo_user', JSON.stringify({
          id: 'demo-admin-id',
          email: 'admin@mksimplo.com',
          role: 'superadmin',
          store_id: null
        }));
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao painel administrativo"
        });
        
        navigate('/admin');
        return;
      }

      // Tentar fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Erro no login:', error);
        throw error;
      }

      console.log('Login bem-sucedido:', data);

      if (data.user) {
        // Verificar se é admin da plataforma
        const { data: adminData } = await supabase
          .from('platform_admins')
          .select('*')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (adminData) {
          console.log('Usuário é admin da plataforma');
          localStorage.setItem('mksimplo_user', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            role: 'superadmin',
            store_id: null
          }));
          navigate('/admin');
        } else {
          // Buscar dados da loja do usuário
          const { data: userStoreData } = await supabase
            .from('user_stores')
            .select('*, stores(*)')
            .eq('user_id', data.user.id)
            .maybeSingle();

          if (userStoreData && userStoreData.stores) {
            console.log('Usuário pertence a uma loja:', userStoreData.stores.name);
            localStorage.setItem('mksimplo_user', JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              role: userStoreData.role,
              store_id: userStoreData.store_id,
              store_name: userStoreData.stores.name
            }));
          } else {
            console.log('Usuário não tem loja associada');
            toast({
              title: "Erro no login",
              description: "Usuário não possui loja associada. Entre em contato com o suporte.",
              variant: "destructive"
            });
            return;
          }
          navigate('/dashboard');
        }

        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao MKsimplo"
        });
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      let errorMessage = "Email ou senha incorretos";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Email ou senha incorretos. Verifique suas credenciais.";
      } else if (error.message === "Email not confirmed") {
        errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (storeName: string, ownerName: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      console.log('Iniciando registro com email:', email);
      
      // Validações básicas
      if (!storeName.trim() || !ownerName.trim() || !email.trim() || !password.trim()) {
        toast({
          title: "Campos obrigatórios",
          description: "Todos os campos são obrigatórios.",
          variant: "destructive"
        });
        return false;
      }

      if (password.length < 6) {
        toast({
          title: "Senha muito curta",
          description: "A senha deve ter pelo menos 6 caracteres.",
          variant: "destructive"
        });
        return false;
      }
      
      // Verificar se já existe uma conta com este email
      const { data: existingStore } = await supabase
        .from('stores')
        .select('email')
        .eq('email', email.trim())
        .maybeSingle();

      if (existingStore) {
        toast({
          title: "Email já cadastrado",
          description: "Este email já possui uma conta. Tente fazer login.",
          variant: "destructive"
        });
        return false;
      }
      
      // Criar o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: ownerName,
            store_name: storeName
          }
        }
      });

      if (authError) {
        console.error('Erro no registro:', authError);
        
        if (authError.message === "User already registered") {
          toast({
            title: "Email já cadastrado",
            description: "Este email já possui uma conta. Tente fazer login.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: authError.message || "Erro ao criar conta. Tente novamente.",
            variant: "destructive"
          });
        }
        return false;
      }

      console.log('Usuário criado no auth:', authData);

      if (!authData.user) {
        toast({
          title: "Erro no cadastro",
          description: "Falha ao criar usuário. Tente novamente.",
          variant: "destructive"
        });
        return false;
      }

      try {
        // Aguardar um tempo maior para garantir que o usuário foi criado completamente
        console.log('Aguardando processamento do usuário...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verificar se o usuário realmente existe antes de prosseguir
        const { data: userCheck } = await supabase.auth.getUser();
        console.log('Verificação do usuário:', userCheck);

        // Criar registro na tabela stores
        console.log('Criando loja...');
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .insert({
            name: storeName.trim(),
            email: email.trim(),
            owner_name: ownerName.trim(),
            plan_type: 'trial',
            status: 'active',
            subscription_status: 'trial',
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .single();

        if (storeError) {
          console.error('Erro detalhado ao criar loja:', storeError);
          
          // Fazer logout para não deixar usuário em estado inconsistente
          await supabase.auth.signOut();
          
          let errorMessage = "Não foi possível configurar sua loja.";
          
          if (storeError.code === '23505') {
            errorMessage = "Este email já possui uma loja cadastrada.";
          } else if (storeError.code === '42501') {
            errorMessage = "Erro de permissão ao criar loja. Tente novamente.";
          }
          
          toast({
            title: "Erro ao criar loja",
            description: errorMessage + " Entre em contato com o suporte se o problema persistir.",
            variant: "destructive"
          });
          return false;
        }

        console.log('Loja criada com sucesso:', storeData);

        if (!storeData) {
          await supabase.auth.signOut();
          toast({
            title: "Erro na criação",
            description: "Falha ao obter dados da loja criada. Tente novamente.",
            variant: "destructive"
          });
          return false;
        }

        // Criar registro na tabela user_stores para associar o usuário à loja
        console.log('Associando usuário à loja...');
        const { error: userStoreError } = await supabase
          .from('user_stores')
          .insert({
            user_id: authData.user.id,
            store_id: storeData.id,
            role: 'owner'
          });

        if (userStoreError) {
          console.error('Erro detalhado ao associar usuário à loja:', userStoreError);
          
          // Tentar fazer logout para não deixar usuário em estado inconsistente
          await supabase.auth.signOut();
          
          toast({
            title: "Erro na associação",
            description: "Problema ao associar usuário à loja. Entre em contato com o suporte.",
            variant: "destructive"
          });
          return false;
        }

        console.log('Usuário associado à loja com sucesso');

        // Fazer logout após criar a conta para que o usuário possa fazer login
        await supabase.auth.signOut();

        toast({
          title: "Conta criada com sucesso!",
          description: "Sua loja foi configurada. Faça login para acessar sua conta.",
        });
        
        return true;

      } catch (setupError: any) {
        console.error('Erro durante configuração da loja:', setupError);
        
        // Tentar fazer logout para não deixar usuário em estado inconsistente
        try {
          await supabase.auth.signOut();
        } catch (logoutError) {
          console.error('Erro no logout:', logoutError);
        }
        
        toast({
          title: "Erro na configuração",
          description: "Problema durante a configuração da loja. Tente novamente em alguns minutos.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      console.error('Erro geral no cadastro:', error);
      
      let errorMessage = "Erro inesperado. Tente novamente.";
      
      if (error.message?.includes('network')) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (error.message?.includes('rate limit')) {
        errorMessage = "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleRegister, loading };
};
