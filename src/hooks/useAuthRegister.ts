
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { registerUser, resendEmailConfirmation } from '@/services/authService';

export const useAuthRegister = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (ownerName: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      await registerUser(ownerName, email, password);

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta. Se não receber, verifique a pasta de spam.",
      });
      
      return true;

    } catch (error: any) {
      console.error('Erro geral no cadastro:', error);
      
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

  const resendConfirmation = async (email: string) => {
    setLoading(true);
    
    try {
      await resendEmailConfirmation(email);

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

  return { handleRegister, resendConfirmation, loading };
};
