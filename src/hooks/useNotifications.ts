
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
      if (!user.empresa_id) return;

      // Para demonstração, criar notificação de teste grátis
      const trialNotification: Notification = {
        id: 'trial_warning',
        type: 'trial_warning',
        title: 'Período de teste ativo',
        message: 'Você está no período de teste gratuito. Aproveite!',
        time: 'Agora',
        read: false
      };

      setNotifications(prev => {
        const exists = prev.find(n => n.id === 'trial_warning');
        if (!exists) {
          return [trialNotification, ...prev];
        }
        return prev;
      });

    } catch (error) {
      console.error('Erro ao verificar status do trial:', error);
    }
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  useEffect(() => {
    checkTrialStatus();
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
