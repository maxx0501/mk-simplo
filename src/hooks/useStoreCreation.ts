
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createNewStore } from '@/services/storeService';

export const useStoreCreation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createStore = async (storeName: string, phone?: string, cnpj?: string, storeType?: string) => {
    setLoading(true);
    
    try {
      console.log('🧼 Iniciando criação de loja com dados limpos...');
      const result = await createNewStore(storeName, phone, cnpj, storeType);

      // Atualizar localStorage
      localStorage.setItem('mksimplo_user', JSON.stringify(result.userData));

      // Forçar atualização da sidebar
      window.dispatchEvent(new Event('storage'));

      toast({
        title: "Loja criada com sucesso!",
        description: `${storeName} foi criada e você já pode começar a usar o sistema. Seus dados começam totalmente limpos.`
      });

      console.log('✅ Loja criada com sistema limpo - sem dados pré-populados');
      return true;

    } catch (error: any) {
      console.error('❌ Erro ao criar loja:', error);
      
      toast({
        title: "Erro inesperado",
        description: error.message || "Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createStore, loading };
};
