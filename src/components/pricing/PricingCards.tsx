
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Crown, Sparkles } from 'lucide-react';

export const PricingCards = () => {
  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar',
      badge: 'Mais Popular',
      features: [
        'Até 50 produtos',
        'Até 2 vendedores',
        'Relatórios básicos',
        'Suporte por email',
        'Dashboard essencial',
        'Controle de estoque'
      ],
      buttonText: 'Começar Grátis',
      featured: false,
      icon: Sparkles
    },
    {
      name: 'Premium',
      price: 'R$ 49',
      period: '/mês',
      description: 'Para empresas em crescimento',
      badge: 'Mais Completo',
      features: [
        'Produtos ilimitados',
        'Vendedores ilimitados',
        'Relatórios avançados',
        'Suporte prioritário 24/7',
        'Backup automático',
        'Integrações avançadas',
        'Analytics detalhados',
        'Multi-lojas'
      ],
      buttonText: 'Assinar Premium',
      featured: true,
      icon: Crown
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
      {plans.map((plan, index) => (
        <Card 
          key={plan.name} 
          className={`relative flex-1 overflow-hidden transition-all duration-500 transform hover:scale-105 ${
            plan.featured 
              ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-0 shadow-2xl ring-4 ring-yellow-400/30' 
              : 'bg-white border-2 border-gray-100 hover:border-blue-300 shadow-xl hover:shadow-2xl'
          }`}
          style={{ animationDelay: `${index * 200}ms` }}
        >
          {/* Badge */}
          {plan.badge && (
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold ${
              plan.featured ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-blue-700'
            }`}>
              {plan.badge}
            </div>
          )}

          <CardHeader className="text-center pb-8 pt-8">
            {/* Icon */}
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              plan.featured 
                ? 'bg-yellow-400 text-black' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            }`}>
              <plan.icon className="w-8 h-8" />
            </div>

            <CardTitle className={`text-3xl font-bold mb-2 ${
              plan.featured ? 'text-white' : 'text-gray-800'
            }`}>
              {plan.name}
            </CardTitle>
            
            <CardDescription className={`text-base ${
              plan.featured ? 'text-blue-100' : 'text-gray-600'
            }`}>
              {plan.description}
            </CardDescription>
            
            {/* Price */}
            <div className="mt-6">
              <div className="flex items-baseline justify-center gap-1">
                <span className={`text-5xl font-black ${
                  plan.featured ? 'text-yellow-400' : 'text-blue-600'
                }`}>
                  {plan.price}
                </span>
                <span className={`text-lg font-medium ${
                  plan.featured ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {plan.period}
                </span>
              </div>
              {plan.name === 'Gratuito' && (
                <p className={`text-sm mt-2 ${
                  plan.featured ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  Para sempre
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Features List */}
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li 
                  key={feature} 
                  className="flex items-start gap-3"
                  style={{ animationDelay: `${(index * 200) + (featureIndex * 100)}ms` }}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                    plan.featured ? 'bg-yellow-400' : 'bg-green-100'
                  }`}>
                    <Check className={`w-4 h-4 ${
                      plan.featured ? 'text-black' : 'text-green-600'
                    }`} />
                  </div>
                  <span className={`text-base leading-relaxed ${
                    plan.featured ? 'text-blue-100' : 'text-gray-700'
                  }`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button 
              className={`w-full font-bold text-lg py-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                plan.featured 
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-black hover:shadow-yellow-400/25' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-blue-500/25'
              }`}
              size="lg"
            >
              {plan.buttonText}
              {plan.featured && <Star className="ml-2 h-5 w-5" />}
            </Button>

            {plan.featured && (
              <p className="text-center text-blue-200 text-sm mt-4 font-medium">
                🔥 Oferta especial por tempo limitado
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
