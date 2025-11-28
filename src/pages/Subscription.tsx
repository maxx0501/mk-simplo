
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold flex items-center text-black">
                <Crown className="w-10 h-10 mr-4 text-blue-600" />
                Assinatura
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Gerencie seu plano e pagamentos</p>
            </div>
            <Button 
              onClick={checkSubscription} 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Atualizar Status
            </Button>
          </div>

          {/* Current Plan Status */}
          {subscriptionInfo && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="flex items-center text-black">
                  <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                  Status da Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 font-medium">Plano Atual</div>
                    <Badge className={`text-sm px-3 py-1 ${
                      subscriptionInfo.plan_type === 'trial' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      subscriptionInfo.plan_type === 'pro' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      'bg-gray-100 text-gray-800 border-gray-300'
                    }`}>
                      {subscriptionInfo.plan_type === 'trial' ? 'Período de Teste' :
                       subscriptionInfo.plan_type === 'pro' ? 'Pro' : 'Desconhecido'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 font-medium">Status</div>
                    <Badge className={`text-sm px-3 py-1 ${
                      subscriptionInfo.subscribed && !isTrialExpired() 
                        ? 'bg-green-100 text-green-800 border-green-300' 
                        : 'bg-red-100 text-red-800 border-red-300'
                    }`}>
                      {subscriptionInfo.subscribed && !isTrialExpired() ? 'Ativa' : 'Expirada'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 font-medium">
                      {subscriptionInfo.plan_type === 'trial' ? 'Teste expira em' : 'Próxima cobrança'}
                    </div>
                    <div className="font-medium text-black">
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
                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Progresso do período de teste</span>
                      <span className="text-sm font-semibold text-black">{getRemainingTrialDays()} de 7 dias restantes</span>
                    </div>
                    <Progress value={getTrialProgress()} className="h-3" />
                    {getRemainingTrialDays() <= 2 && (
                      <div className="flex items-center space-x-3 mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
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
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-black">Gerenciar Assinatura</h3>
                    <p className="text-gray-600 mt-1">Altere seu método de pagamento ou cancele sua assinatura</p>
                  </div>
                  <Button 
                    onClick={handleManageSubscription}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Gerenciar no Stripe
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subscription Plans */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="text-black text-2xl">Planos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SubscriptionPlans 
                currentPlan={subscriptionInfo?.plan_type}
                onPlanChange={checkSubscription}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
