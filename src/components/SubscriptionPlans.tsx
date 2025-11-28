
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
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
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 49',
      period: '/mês',
      description: 'Plano completo para sua loja',
      features: [
        'Acesso ilimitado',
        'Produtos ilimitados',
        'Relatórios avançados',
        'Suporte prioritário 24/7',
        'Dashboard completo',
        'Controle de estoque',
        'Múltiplos usuários',
        'Integrações avançadas',
        'API completa',
        'Backup automático'
      ],
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
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
      toast({
        title: "Período de teste",
        description: "Você já está no período de teste gratuito!"
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {plans.map((plan) => {
        const Icon = plan.icon;
        const isCurrentPlan = currentPlan === plan.id;
        
        return (
          <Card 
            key={plan.id} 
            className={`relative ${plan.borderColor} ${
              isCurrentPlan ? 'ring-2 ring-offset-2 ring-blue-500' : ''
            } ${plan.popular ? 'border-purple-300 shadow-lg' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                Mais Popular
              </Badge>
            )}
            
            {isCurrentPlan && (
              <Badge className="absolute -top-2 right-4 bg-blue-600">
                Plano Atual
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className={`w-12 h-12 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`w-6 h-6 ${plan.color}`} />
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-gray-600">{plan.period}</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                variant={isCurrentPlan ? "secondary" : plan.popular ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id || isCurrentPlan}
              >
                {loading === plan.id ? 'Processando...' : 
                 isCurrentPlan ? 'Plano Ativo' : 
                 plan.id === 'trial' ? 'Iniciar Teste' : 'Assinar Agora'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;
