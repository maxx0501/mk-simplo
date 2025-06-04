
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

      // Garantir logout antes de tentar novo login
      await supabase.auth.signOut({ scope: 'global' });
      localStorage.clear();
      sessionStorage.clear();

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
            console.log('Usuário não possui loja, configurando dados básicos');
            localStorage.setItem('mksimplo_user', JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              role: 'owner',
              store_id: null,
              store_name: null
            }));
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
        errorMessage = "Email ou senha incorretos. Verifique se sua conta foi confirmada.";
      } else if (error.message === "Email not confirmed") {
        errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
      } else if (error.message.includes("Email")) {
        errorMessage = "Problema com o email. Verifique se está correto.";
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

  return { handleLogin, loading };
};
