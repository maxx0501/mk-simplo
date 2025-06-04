
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { loginUser } from '@/services/authService';

export const useAuthLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);

    try {
      const result = await loginUser(email, password);
      
      if (result.isDemo) {
        localStorage.setItem('mksimplo_user', JSON.stringify(result.userData));
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao painel administrativo"
        });
        
        navigate('/admin');
        return;
      }

      localStorage.setItem('mksimplo_user', JSON.stringify(result.userData));
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao MKsimplo"
      });

      navigate(result.redirectTo || '/dashboard');

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

  return { handleLogin, loading };
};
