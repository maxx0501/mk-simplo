
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Clock, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import SubscriptionPlans from '@/components/SubscriptionPlans';

interface SubscriptionInfo {
  subscribed: boolean;
  plan_type: string;
  subscription_end?: string;
  trial_end?: string;
}

const Subscription = () => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Auth check result:', user);
      
      if (!user) {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página",
          variant: "destructive"
        });
        navigate('/login');
        return false;
      }
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/login');
      return false;
    }
  };

  const checkSubscription = async () => {
    try {
      setLoading(true);
      
      const authValid = await checkAuth();
      if (!authValid) return;

      console.log('Iniciando verificação de assinatura...');
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      console.log('Resposta da função check-subscription:', { data, error });
      
      if (error) {
        console.error('Erro na função:', error);
        throw error;
      }
      
      setSubscriptionInfo(data);
      console.log('Informações de assinatura atualizadas:', data);
    } catch (error: any) {
      console.error('Erro ao verificar assinatura:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao verificar status da assinatura",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const authValid = await checkAuth();
      if (!authValid) return;

      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Erro ao abrir portal:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao abrir portal de gerenciamento",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  const getRemainingTrialDays = () => {
    if (!subscriptionInfo?.trial_end) return 0;
    const now = new Date();
    const trialEnd = new Date(subscriptionInfo.trial_end);
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getTrialProgress = () => {
    const remainingDays = getRemainingTrialDays();
    return ((7 - remainingDays) / 7) * 100;
  };

  const isTrialExpired = () => {
    return subscriptionInfo?.plan_type === 'trial' && getRemainingTrialDays() <= 0;
  };

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Verificando autenticação...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Crown className="w-8 h-8 mr-3 text-purple-600" />
              Assinatura
            </h1>
            <p className="text-gray-600 mt-1">Gerencie seu plano e pagamentos</p>
          </div>
          <Button onClick={checkSubscription} variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Atualizar Status
          </Button>
        </div>

        {/* Current Plan Status */}
        {subscriptionInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Status da Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Plano Atual</div>
                  <Badge className={
                    subscriptionInfo.plan_type === 'trial' ? 'bg-yellow-100 text-yellow-800' :
                    subscriptionInfo.plan_type === 'pro' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {subscriptionInfo.plan_type === 'trial' ? 'Período de Teste' :
                     subscriptionInfo.plan_type === 'pro' ? 'Pro' : 'Desconhecido'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Status</div>
                  <Badge className={
                    subscriptionInfo.subscribed && !isTrialExpired() 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }>
                    {subscriptionInfo.subscribed && !isTrialExpired() ? 'Ativa' : 'Expirada'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    {subscriptionInfo.plan_type === 'trial' ? 'Teste expira em' : 'Próxima cobrança'}
                  </div>
                  <div className="font-medium">
                    {subscriptionInfo.plan_type === 'trial' 
                      ? `${getRemainingTrialDays()} dias`
                      : subscriptionInfo.subscription_end 
                        ? new Date(subscriptionInfo.subscription_end).toLocaleDateString('pt-BR')
                        : 'N/A'
                    }
                  </div>
                </div>
              </div>

              {/* Trial Progress */}
              {subscriptionInfo.plan_type === 'trial' && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progresso do período de teste</span>
                    <span className="text-sm font-medium">{getRemainingTrialDays()} de 7 dias restantes</span>
                  </div>
                  <Progress value={getTrialProgress()} className="h-2" />
                  {getRemainingTrialDays() <= 2 && (
                    <div className="flex items-center space-x-2 mt-3 p-3 bg-orange-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-orange-700">
                        {isTrialExpired() 
                          ? 'Seu período de teste expirou. Assine o plano Pro para continuar usando a plataforma.'
                          : 'Seu período de teste expira em breve. Assine o plano Pro para continuar usando a plataforma.'
                        }
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Manage Subscription Button */}
        {subscriptionInfo?.plan_type === 'pro' && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Gerenciar Assinatura</h3>
                  <p className="text-gray-600">Altere seu método de pagamento ou cancele sua assinatura</p>
                </div>
                <Button onClick={handleManageSubscription}>
                  Gerenciar no Stripe
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Planos Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionPlans 
              currentPlan={subscriptionInfo?.plan_type}
              onPlanChange={checkSubscription}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
