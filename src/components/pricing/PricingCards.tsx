
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export const PricingCards = () => {
  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Ideal para começar',
      features: [
        'Até 50 produtos',
        'Até 2 vendedores',
        'Relatórios básicos',
        'Suporte por email'
      ],
      buttonText: 'Começar Grátis',
      featured: false
    },
    {
      name: 'Premium',
      price: 'R$ 49',
      period: '/mês',
      description: 'Para empresas em crescimento',
      features: [
        'Produtos ilimitados',
        'Vendedores ilimitados',
        'Relatórios avançados',
        'Suporte prioritário',
        'Backup automático',
        'Integrações avançadas'
      ],
      buttonText: 'Assinar Premium',
      featured: true
    }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.name} 
          className={`flex-1 ${
            plan.featured 
              ? 'bg-dark-blue text-white border-golden shadow-2xl' 
              : 'card-modern border-dark-blue/20'
          }`}
        >
          <CardHeader className="text-center pb-8">
            <CardTitle className={`text-2xl font-bold ${plan.featured ? 'text-white' : 'text-dark-blue'}`}>
              {plan.name}
            </CardTitle>
            <CardDescription className={plan.featured ? 'text-gray-200' : 'text-gray-600'}>
              {plan.description}
            </CardDescription>
            <div className="mt-4">
              <span className={`text-4xl font-bold ${plan.featured ? 'text-golden' : 'text-dark-blue'}`}>
                {plan.price}
              </span>
              <span className={`text-lg ${plan.featured ? 'text-gray-200' : 'text-gray-600'}`}>
                {plan.period}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center space-x-3">
                  <Check className={`h-5 w-5 ${plan.featured ? 'text-golden' : 'text-green-600'}`} />
                  <span className={plan.featured ? 'text-gray-200' : 'text-gray-700'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-6">
              <Button 
                className={`w-full ${
                  plan.featured 
                    ? 'bg-golden text-black hover:bg-white hover:text-dark-blue' 
                    : 'btn-primary'
                }`}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
