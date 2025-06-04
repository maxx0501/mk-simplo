
import { supabase } from '@/integrations/supabase/client';

export const clearSession = async () => {
  try {
    console.log('Limpando sessão...');
    
    // Forçar logout completo do Supabase
    await supabase.auth.signOut({ scope: 'global' });
    
    // Limpar todos os dados locais
    localStorage.clear();
    sessionStorage.clear();
    
    // Aguardar um pouco para garantir que a limpeza foi feita
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('Sessão completamente limpa');
  } catch (error) {
    console.error('Erro ao limpar sessão:', error);
    // Mesmo com erro, limpar localStorage
    localStorage.clear();
    sessionStorage.clear();
  }
};

export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem('mksimplo_user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erro ao recuperar dados do usuário:', error);
    return null;
  }
};

export const setStoredUser = (userData: any) => {
  try {
    localStorage.setItem('mksimplo_user', JSON.stringify(userData));
    
    // Disparar evento customizado para atualizar componentes
    window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));
  } catch (error) {
    console.error('Erro ao armazenar dados do usuário:', error);
  }
};
