
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, RefreshCw } from 'lucide-react';
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
  const [refreshing, setRefreshing] = useState(false);
  const user = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
  const navigate = useNavigate();

  // Extrair nome do usuário do email ou usar o nome completo se disponível
  const getUserDisplayName = () => {
    if (user.full_name) {
      return user.full_name;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Usuário';
  };

  const checkSubscription = async (showLoading = false) => {
    try {
      if (showLoading) setRefreshing(true);
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (!error && data) {
        setSubscriptionInfo(data);
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    } finally {
      if (showLoading) setRefreshing(false);
    }
  };

  useEffect(() => {
    checkSubscription();
    // Verificar a cada 30 segundos
    const interval = setInterval(() => checkSubscription(), 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePlanClick = () => {
    navigate('/subscription');
  };

  const handleRefresh = () => {
    checkSubscription(true);
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
    if (!subscriptionInfo) return 'text-gray-600 border-gray-600 bg-gray-50';
    
    if (subscriptionInfo.plan_type === 'pro' && subscriptionInfo.subscribed) {
      return 'text-blue-700 border-blue-300 bg-blue-50 hover:bg-blue-100';
    }
    
    if (subscriptionInfo.plan_type === 'trial') {
      const trialEnd = subscriptionInfo.trial_end ? new Date(subscriptionInfo.trial_end) : null;
      const now = new Date();
      const remainingDays = trialEnd ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      if (remainingDays > 0) {
        return remainingDays <= 2 
          ? 'text-orange-700 border-orange-300 bg-orange-50 hover:bg-orange-100' 
          : 'text-green-700 border-green-300 bg-green-50 hover:bg-green-100';
      } else {
        return 'text-red-700 border-red-300 bg-red-50 hover:bg-red-100';
      }
    }
    
    return 'text-blue-700 border-blue-300 bg-blue-50 hover:bg-blue-100';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4 md:ml-0">
            <h2 className="text-lg font-semibold text-black">
              {user.store_name || 'Empresa Exemplo'}
            </h2>
            <p className="text-sm text-gray-500">
              Bem-vindo, {getUserDisplayName()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Badge 
            variant="outline" 
            className={`${getPlanColor()} cursor-pointer transition-all duration-200 font-medium px-3 py-1 border-2`}
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
