
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingCards } from '@/components/pricing/PricingCards';
import { AppFooter } from '@/components/footer/AppFooter';
import { Store, Package, TrendingUp, Users, Shield, Zap } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Package,
      title: 'Gestão de Produtos',
      description: 'Controle completo do seu estoque com alertas de baixa quantidade.'
    },
    {
      icon: TrendingUp,
      title: 'Relatórios Avançados',
      description: 'Análises detalhadas para tomar decisões inteligentes.'
    },
    {
      icon: Users,
      title: 'Múltiplos Vendedores',
      description: 'Gerencie sua equipe de vendas com permissões personalizadas.'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com criptografia de ponta.'
    },
    {
      icon: Zap,
      title: 'Interface Rápida',
      description: 'Sistema otimizado para máxima produtividade.'
    },
    {
      icon: Store,
      title: 'Multi-lojas',
      description: 'Gerencie várias lojas a partir de um único painel.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Store className="h-8 w-8 text-golden" />
              <span className="text-xl font-bold text-dark-blue">MKsimplo</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button className="btn-primary">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-dark-blue mb-6">
            Gerencie seu Estoque com
            <span className="text-golden"> Inteligência</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo de gestão de estoque para empresas modernas. 
            Controle vendas, produtos e vendedores em uma plataforma única e intuitiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Começar Grátis
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-blue mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para gerenciar seu negócio
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="card-modern text-center">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 bg-gradient-to-br from-dark-blue to-golden rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-dark-blue">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-blue mb-4">
              Planos que Cabem no seu Bolso
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o seu negócio
            </p>
          </div>
          <PricingCards />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para Revolucionar seu Estoque?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Junte-se a milhares de empresas que já transformaram sua gestão
          </p>
          <Link to="/register">
            <Button size="lg" className="btn-secondary text-lg px-8 py-4">
              Começar Agora - Grátis
            </Button>
          </Link>
        </div>
      </section>

      <AppFooter />
    </div>
  );
};

export default Index;
