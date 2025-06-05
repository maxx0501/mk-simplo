
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'trial_warning' | 'trial_expired' | 'subscription_expired' | 'access_denied';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  const checkTrialStatus = useCallback(async () => {
    try {
      const userData = localStorage.getItem('mksimplo_user');
      if (!userData) return;

      const user = JSON.parse(userData);
      if (!user.store_id) return;

      // Buscar informações da loja
      const { data: storeData } = await supabase
        .from('stores')
        .select('trial_ends_at, plan_type, subscription_id')
        .eq('id', user.store_id)
        .maybeSingle();

      if (!storeData) return;

      const now = new Date();
      
      // Se tem assinatura paga ativa, não precisa verificar trial
      if (storeData.subscription_id && storeData.plan_type === 'pro') {
        return;
      }

      // Verificar status do período de teste
      if (storeData.trial_ends_at) {
        const trialEnd = new Date(storeData.trial_ends_at);
        const diffTime = trialEnd.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Trial expirado
        if (diffDays <= 0) {
          const expiredNotification: Notification = {
            id: 'trial_expired',
            type: 'trial_expired',
            title: 'Período de teste expirado',
            message: 'Seu período de teste expirou. Assine o plano Pro para continuar usando a plataforma.',
            time: 'Agora',
            read: false
          };

          setNotifications(prev => {
            const exists = prev.find(n => n.id === 'trial_expired');
            if (!exists) {
              toast({
                title: expiredNotification.title,
                description: expiredNotification.message,
                variant: "destructive"
              });
              return [expiredNotification, ...prev];
            }
            return prev;
          });
        }
        // Trial próximo do vencimento (2 dias ou menos)
        else if (diffDays <= 2) {
          const warningNotification: Notification = {
            id: 'trial_warning',
            type: 'trial_warning',
            title: 'Período de teste expirando',
            message: `Seu período de teste expira em ${diffDays} dia${diffDays > 1 ? 's' : ''}. Assine o plano Pro para continuar.`,
            time: 'Agora',
            read: false
          };

          setNotifications(prev => {
            const exists = prev.find(n => n.id === 'trial_warning');
            if (!exists) {
              toast({
                title: warningNotification.title,
                description: warningNotification.message,
                variant: "destructive"
              });
              return [warningNotification, ...prev];
            }
            return prev;
          });
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status do trial:', error);
    }
  }, [toast]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Verificar status a cada 5 minutos
  useEffect(() => {
    checkTrialStatus();
    const interval = setInterval(checkTrialStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkTrialStatus]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    checkTrialStatus
  };
};
