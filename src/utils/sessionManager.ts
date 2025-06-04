
import { supabase } from '@/integrations/supabase/client';

export const clearSession = async () => {
  try {
    // Forçar logout completo
    await supabase.auth.signOut({ scope: 'global' });
    
    // Limpar todos os dados locais
    localStorage.clear();
    sessionStorage.clear();
    
    // Aguardar um pouco para garantir que a limpeza foi feita
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Sessão completamente limpa, página de login pronta');
  } catch (error) {
    console.error('Erro ao limpar sessão:', error);
    // Mesmo com erro, limpar localStorage
    localStorage.clear();
    sessionStorage.clear();
  }
};
