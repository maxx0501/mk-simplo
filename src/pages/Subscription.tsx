
import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { PricingCards } from '@/components/pricing/PricingCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Check, Calendar, CreditCard } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';

export default function Subscription() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
  }, []);

  // Se o usuário não tem loja, mostrar opções de acesso
  if (!user?.store_id) {
    return (
      <ModernDashboardLayout>
        <StoreAccessOptions />
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-12 w-12 text-golden" />
          </div>
          <h1 className="text-4xl font-bold text-dark-blue mb-4">Assinaturas</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta ao seu negócio e desbloqueie todo o potencial do MKsimplo
          </p>
        </div>

        {/* Current Plan Status */}
        <Card className="card-modern border-golden">
          <CardHeader>
            <CardTitle className="text-dark-blue flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Plano Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h3 className="text-2xl font-bold text-golden">Plano Gratuito</h3>
                <p className="text-gray-600">Válido até o fim dos tempos</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    Até 50 produtos
                  </span>
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    Até 2 vendedores
                  </span>
                </div>
              </div>
              <Button className="btn-secondary">
                <CreditCard className="w-4 h-4 mr-2" />
                Fazer Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-dark-blue mb-4">
              Escolha Seu Plano
            </h2>
            <p className="text-gray-600">
              Mude de plano a qualquer momento, sem compromisso
            </p>
          </div>
          <PricingCards />
        </div>

        {/* Benefits Section */}
        <Card className="card-modern bg-gradient-to-r from-dark-blue to-golden text-white">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Por que fazer upgrade para o Premium?
            </CardTitle>
            <CardDescription className="text-gray-200">
              Benefícios exclusivos para impulsionar seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-golden" />
                  <span>Produtos e vendedores ilimitados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-golden" />
                  <span>Relatórios avançados e analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-golden" />
                  <span>Backup automático diário</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-golden" />
                  <span>Suporte prioritário 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-golden" />
                  <span>Integrações com marketplaces</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-golden" />
                  <span>API para desenvolvimento personalizado</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernDashboardLayout>
  );
}
