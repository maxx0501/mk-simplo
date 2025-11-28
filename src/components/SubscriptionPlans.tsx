import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, Shield, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface SubscriptionPlansProps {
  currentPlan?: string;
  onPlanChange?: () => void;
}

const SubscriptionPlans = ({ currentPlan, onPlanChange }: SubscriptionPlansProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'trial',
      name: 'Período de Teste',
      price: 'R$ 0',
      period: '7 dias',
      description: 'Experimente todas as funcionalidades gratuitamente',
      features: [
        'Acesso completo por 7 dias',
        'Produtos ilimitados',
        'Relatórios avançados',
        'Suporte por email',
        'Dashboard completo',
        'Controle de estoque'
      ],
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-300',
      buttonColor: 'bg-yellow-400 hover:bg-yellow-500 text-black'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 1',
      originalPrice: 'R$ 29,90',
      period: '/mês',
      testPrice: true,
      description: 'Plano completo para sua empresa crescer',
      features: [
        'Acesso ilimitado',
        'Produtos ilimitados',
        'Relatórios avançados',
        'Suporte prioritário 24/7',
        'Dashboard completo',
        'Controle de estoque',
        'Múltiplos usuários',
        'Sistema personalizado',
        'Exportação de dados',
        'Backup automático'
      ],
      icon: Crown,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
      buttonColor: 'bg-yellow-400 hover:bg-yellow-500 text-black',
      popular: true
    }
  ];

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para assinar um plano",
          variant: "destructive"
        });
        navigate('/login');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/login');
      return false;
    }
  };

  const handleSubscribe = async (planType: string) => {
    if (planType === 'trial') {
      if (currentPlan === 'pro') {
        toast({
          title: "Plano não disponível",
          description: "Você já possui o plano Pro ativo. Não é possível voltar ao período de teste.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Período de teste",
        description: "Você já está no período de teste gratuito!",
        variant: "default"
      });
      return;
    }

    setLoading(planType);
    try {
      const authValid = await checkAuth();
      if (!authValid) return;

      console.log('Iniciando checkout para plano:', planType);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan_type: planType }
      });

      console.log('Resposta do checkout:', { data, error });

      if (error) {
        console.error('Erro na função create-checkout:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecionando para checkout:', data.url);
        window.open(data.url, '_blank');
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (error: any) {
      console.error('Erro ao criar checkout:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar pagamento",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const isButtonDisabled = (planId: string) => {
    if (loading === planId) return true;
    if (currentPlan === planId) return true;
    if (planId === 'trial' && currentPlan === 'pro') return true;
    return false;
  };

  const getButtonText = (plan: any) => {
    if (loading === plan.id) {
      return (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
          Processando...
        </div>
      );
    }
    
    if (currentPlan === plan.id) {
      return (
        <>
          <Shield className="w-4 h-4 mr-2" />
          Plano Ativo
        </>
      );
    }
    
    if (plan.id === 'trial' && currentPlan === 'pro') {
      return (
        <>
          <Lock className="w-4 h-4 mr-2" />
          Não Disponível
        </>
      );
    }
    
    if (plan.id === 'trial') {
      return (
        <>
          <Zap className="w-4 h-4 mr-2" />
          Iniciar Teste
        </>
      );
    }
    
    return (
      <>
        <Star className="w-4 h-4 mr-2" />
        Assinar Agora
      </>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto p-6">
      {plans.map((plan) => {
        const Icon = plan.icon;
        const isCurrentPlan = currentPlan === plan.id;
        const isDisabled = isButtonDisabled(plan.id);
        
        return (
          <Card 
            key={plan.id} 
            className={`relative transition-all duration-300 h-full flex flex-col bg-white border-2 shadow-lg hover:shadow-xl ${
              isCurrentPlan 
                ? `${plan.borderColor} ${plan.bgColor} ring-2 ring-offset-2 ring-blue-500 scale-105` 
                : `${plan.borderColor} ${plan.bgColor}`
            } ${plan.popular ? 'border-blue-400 shadow-blue-200' : ''}`}
          >
            {plan.popular && !isCurrentPlan && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Mais Popular
              </Badge>
            )}
            
            {isCurrentPlan && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white shadow-lg">
                <Shield className="w-3 h-3 mr-1" />
                Plano Atual
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 ${plan.bgColor} border-2 ${plan.borderColor} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <Icon className={`w-8 h-8 ${plan.color}`} />
              </div>
              <CardTitle className="text-2xl font-bold text-black">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-black">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 line-through">{plan.originalPrice}</div>
                    {plan.testPrice && (
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
                        PREÇO DE TESTE
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <p className="text-gray-600 mt-3">{plan.description}</p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full h-12 font-semibold text-base shadow-lg transition-all ${
                  isDisabled 
                    ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                    : isCurrentPlan 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : plan.buttonColor
                } ${!isDisabled && !isCurrentPlan ? 'hover:shadow-xl' : ''}`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isDisabled}
              >
                {getButtonText(plan)}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;
