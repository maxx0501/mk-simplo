
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlansProps {
  currentPlan?: string;
  onPlanChange?: () => void;
}

const SubscriptionPlans = ({ currentPlan, onPlanChange }: SubscriptionPlansProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const plans = [
    {
      id: 'trial',
      name: 'Teste Grátis',
      price: 'R$ 0',
      period: '7 dias',
      description: 'Perfeito para conhecer a plataforma',
      features: [
        'Até 50 produtos',
        'Relatórios básicos',
        'Suporte por email',
        'Dashboard básico'
      ],
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'basic',
      name: 'Básico',
      price: 'R$ 29',
      period: '/mês',
      description: 'Ideal para pequenas lojas',
      features: [
        'Produtos ilimitados',
        'Relatórios avançados',
        'Suporte prioritário',
        'Dashboard completo',
        'Controle de estoque',
        'Gestão de vendas'
      ],
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 49',
      period: '/mês',
      description: 'Para lojas em crescimento',
      features: [
        'Tudo do plano Básico',
        'Múltiplos usuários',
        'Integrações avançadas',
        'Suporte 24/7',
        'Dashboard personalizado',
        'API completa',
        'Backup automático'
      ],
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

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
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan_type: planType }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const Icon = plan.icon;
        const isCurrentPlan = currentPlan === plan.id;
        
        return (
          <Card 
            key={plan.id} 
            className={`relative ${plan.borderColor} ${isCurrentPlan ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          >
            {isCurrentPlan && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
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
                className="w-full"
                variant={isCurrentPlan ? "secondary" : "default"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id || isCurrentPlan}
              >
                {loading === plan.id ? 'Processando...' : 
                 isCurrentPlan ? 'Plano Ativo' : 
                 plan.id === 'trial' ? 'Período de Teste' : 'Assinar Agora'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;
