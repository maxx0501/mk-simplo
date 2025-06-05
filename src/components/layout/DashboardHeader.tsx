
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationDropdown } from '../NotificationDropdown';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionInfo {
  subscribed: boolean;
  plan_type: string;
  trial_end?: string;
}

export const DashboardHeader = () => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const user = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
  const navigate = useNavigate();

  const checkSubscription = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (!error && data) {
        setSubscriptionInfo(data);
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    }
  };

  useEffect(() => {
    checkSubscription();
    // Verificar a cada 30 segundos
    const interval = setInterval(checkSubscription, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePlanClick = () => {
    navigate('/subscription');
  };

  const getPlanDisplay = () => {
    if (!subscriptionInfo) return 'Verificando...';
    
    if (subscriptionInfo.plan_type === 'pro' && subscriptionInfo.subscribed) {
      return 'Plano Pro';
    }
    
    if (subscriptionInfo.plan_type === 'trial') {
      const trialEnd = subscriptionInfo.trial_end ? new Date(subscriptionInfo.trial_end) : null;
      const now = new Date();
      const remainingDays = trialEnd ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      if (remainingDays > 0) {
        return `Teste (${remainingDays}d)`;
      } else {
        return 'Teste Expirado';
      }
    }
    
    return 'Plano Gratuito';
  };

  const getPlanColor = () => {
    if (!subscriptionInfo) return 'text-gray-600 border-gray-600';
    
    if (subscriptionInfo.plan_type === 'pro' && subscriptionInfo.subscribed) {
      return 'text-purple-600 border-purple-600';
    }
    
    if (subscriptionInfo.plan_type === 'trial') {
      const trialEnd = subscriptionInfo.trial_end ? new Date(subscriptionInfo.trial_end) : null;
      const now = new Date();
      const remainingDays = trialEnd ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      if (remainingDays > 0) {
        return remainingDays <= 2 ? 'text-orange-600 border-orange-600' : 'text-green-600 border-green-600';
      } else {
        return 'text-red-600 border-red-600';
      }
    }
    
    return 'text-blue-600 border-blue-600';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4 md:ml-0">
            <h2 className="text-lg font-semibold text-gray-900">
              {user.store_name || 'Loja Exemplo'}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge 
            variant="outline" 
            className={`${getPlanColor()} cursor-pointer hover:bg-opacity-10 transition-colors`}
            onClick={handlePlanClick}
          >
            {getPlanDisplay()}
          </Badge>
          
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
};
