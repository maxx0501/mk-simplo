
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
        
        // Tratamento específico para email não confirmado
        if (error.message === "Email not confirmed") {
          toast({
            title: "Email não confirmado",
            description: "Verifique sua caixa de entrada ou clique em 'Reenviar confirmação' se não recebeu o email.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
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
            console.log('Usuário já tem loja associada:', userStoreData.stores.name);
            localStorage.setItem('mksimplo_user', JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              role: userStoreData.role,
              store_id: userStoreData.store_id,
              store_name: userStoreData.stores.name
            }));
            navigate('/dashboard');
          } else {
            console.log('Usuário não tem loja associada, redirecionando para criação...');
            
            // Salvar dados do usuário sem loja
            localStorage.setItem('mksimplo_user', JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              role: 'owner',
              store_id: null,
              store_name: null
            }));
            
            // Redirecionar para página de criação de loja
            navigate('/create-store');
          }
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
        errorMessage = "Email não confirmado. Clique em 'Reenviar confirmação' abaixo.";
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

  const handleRegister = async (ownerName: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      console.log('=== INICIANDO CADASTRO ===');
      console.log('Email:', email);
      console.log('Nome do proprietário:', ownerName);
      
      // Validações básicas
      if (!ownerName.trim() || !email.trim() || !password.trim()) {
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
      
      // Criar o usuário no Supabase Auth
      console.log('Criando usuário no Supabase Auth...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: ownerName
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (authError) {
        console.error('Erro no auth:', authError);
        
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

      console.log('Usuário criado no auth com sucesso:', authData.user?.id);

      if (!authData.user) {
        toast({
          title: "Erro no cadastro",
          description: "Falha ao criar usuário. Tente novamente.",
          variant: "destructive"
        });
        return false;
      }

      // Mensagem de sucesso
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta. Se não receber, verifique a pasta de spam.",
      });
      
      return true;

    } catch (error: any) {
      console.error('Erro geral no cadastro:', error);
      
      toast({
        title: "Erro no cadastro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async (email: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email reenviado!",
        description: "Verifique sua caixa de entrada. O email pode levar alguns minutos para chegar.",
      });
    } catch (error: any) {
      console.error('Erro ao reenviar confirmação:', error);
      toast({
        title: "Erro ao reenviar email",
        description: error.message || "Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (storeName: string, phone?: string, cnpj?: string) => {
    setLoading(true);
    
    try {
      console.log('Criando loja:', storeName);
      
      const user = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
      
      if (!user.id) {
        toast({
          title: "Erro",
          description: "Usuário não encontrado. Faça login novamente.",
          variant: "destructive"
        });
        return false;
      }

      // Criar a loja
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .insert({
          name: storeName,
          email: user.email,
          phone: phone || null,
          cnpj: cnpj || null,
          owner_name: user.email?.split('@')[0] || 'Proprietário',
          plan_type: 'free',
          status: 'active',
          trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (storeError) {
        console.error('Erro ao criar loja:', storeError);
        toast({
          title: "Erro ao criar loja",
          description: storeError.message || "Não foi possível criar a loja.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Loja criada com sucesso:', storeData);

      // Associar usuário à loja
      const { error: userStoreError } = await supabase
        .from('user_stores')
        .insert({
          user_id: user.id,
          store_id: storeData.id,
          role: 'owner'
        });

      if (userStoreError) {
        console.error('Erro ao associar usuário à loja:', userStoreError);
        toast({
          title: "Erro ao associar loja",
          description: "Loja criada mas não foi possível associá-la ao usuário.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Usuário associado à loja com sucesso');

      // Atualizar dados do usuário no localStorage
      const updatedUser = {
        ...user,
        store_id: storeData.id,
        store_name: storeData.name
      };
      
      localStorage.setItem('mksimplo_user', JSON.stringify(updatedUser));

      toast({
        title: "Loja criada com sucesso!",
        description: `${storeName} foi criada e você já pode começar a usar o sistema.`
      });

      return true;

    } catch (error: any) {
      console.error('Erro geral ao criar loja:', error);
      
      toast({
        title: "Erro ao criar loja",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleRegister, resendConfirmation, createStore, loading };
};
