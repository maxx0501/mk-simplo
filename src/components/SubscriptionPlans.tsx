
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, Shield } from 'lucide-react';
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
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 1',
      originalPrice: 'R$ 29,90',
      period: '/mês',
      testPrice: true,
      description: 'Plano completo para sua loja crescer',
      features: [
        'Acesso ilimitado',
        'Produtos ilimitados',
        'Relatórios avançados',
        'Suporte prioritário 24/7',
        'Dashboard completo',
        'Controle de estoque',
        'Múltiplos usuários',
        'Catálogo online personalizado',
        'Exportação de dados',
        'Backup automático'
      ],
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-300',
      buttonColor: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {plans.map((plan) => {
        const Icon = plan.icon;
        const isCurrentPlan = currentPlan === plan.id;
        
        return (
          <Card 
            key={plan.id} 
            className={`relative ${plan.borderColor} ${plan.bgColor} shadow-lg hover:shadow-xl transition-all duration-300 ${
              isCurrentPlan ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : ''
            } ${plan.popular ? 'border-purple-400 shadow-purple-200' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Mais Popular
              </Badge>
            )}
            
            {isCurrentPlan && (
              <Badge className="absolute -top-3 right-4 bg-blue-600 text-white shadow-lg">
                <Shield className="w-3 h-3 mr-1" />
                Plano Atual
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 ${plan.bgColor} border-2 ${plan.borderColor} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <Icon className={`w-8 h-8 ${plan.color}`} />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-900">
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
            
            <CardContent className="pt-0">
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full h-12 font-semibold text-base shadow-lg hover:shadow-xl transition-all ${
                  plan.popular ? plan.buttonColor : plan.buttonColor
                }`}
                variant={isCurrentPlan ? "secondary" : "default"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id || isCurrentPlan}
              >
                {loading === plan.id ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </div>
                ) : isCurrentPlan ? (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Plano Ativo
                  </>
                ) : plan.id === 'trial' ? (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Iniciar Teste
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Assinar Agora
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;
