
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Função para gerar nomes únicos de lojas
const generateUniqueStoreName = (email: string) => {
  const baseNames = [
    'Loja Premium', 'MegaStore', 'Super Market', 'Elite Store', 'Top Shopping',
    'Nova Loja', 'Best Store', 'Quick Shop', 'Smart Store', 'Fast Market',
    'Modern Store', 'City Shop', 'Express Store', 'Prime Market', 'Blue Store'
  ];
  
  const emailPrefix = email.split('@')[0];
  const randomName = baseNames[Math.floor(Math.random() * baseNames.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomName} ${emailPrefix.charAt(0).toUpperCase()}${emailPrefix.slice(1)} ${randomNumber}`;
};

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

  const handleRegister = async (storeName: string, ownerName: string, email: string, password: string, phone?: string, cnpj?: string) => {
    setLoading(true);
    
    try {
      console.log('Iniciando registro com email:', email);
      
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
            store_name: storeName,
            phone: phone
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

      if (authData.user) {
        // Criar registro na tabela stores
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .insert({
            name: storeName,
            email: email.trim(),
            owner_name: ownerName,
            phone: phone || null,
            cnpj: cnpj || null,
            plan_type: 'trial',
            status: 'active',
            subscription_status: 'trial',
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .single();

        if (storeError) {
          console.error('Erro ao criar loja:', storeError);
          toast({
            title: "Erro ao criar loja",
            description: "Conta criada mas houve problema ao configurar a loja.",
            variant: "destructive"
          });
          return false;
        }

        console.log('Loja criada com sucesso:', storeData);

        // Criar registro na tabela user_stores para associar o usuário à loja
        const { error: userStoreError } = await supabase
          .from('user_stores')
          .insert({
            user_id: authData.user.id,
            store_id: storeData.id,
            role: 'owner'
          });

        if (userStoreError) {
          console.error('Erro ao associar usuário à loja:', userStoreError);
          toast({
            title: "Erro na associação",
            description: "Problema ao associar usuário à loja.",
            variant: "destructive"
          });
          return false;
        }

        console.log('Usuário associado à loja com sucesso');

        toast({
          title: "Conta criada com sucesso!",
          description: "Faça login para acessar sua conta.",
        });
        
        return true;
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleRegister, loading };
};
