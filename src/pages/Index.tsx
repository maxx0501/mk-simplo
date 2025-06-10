
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingCards } from '@/components/pricing/PricingCards';
import { AppFooter } from '@/components/footer/AppFooter';
import { Store, Package, TrendingUp, Users, Shield, Zap, ArrowRight, Star, CheckCircle } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Package,
      title: 'Gestão de Produtos',
      description: 'Controle completo do seu estoque com alertas de baixa quantidade e organização inteligente.'
    },
    {
      icon: TrendingUp,
      title: 'Relatórios Avançados',
      description: 'Análises detalhadas e métricas em tempo real para decisões estratégicas.'
    },
    {
      icon: Users,
      title: 'Múltiplos Vendedores',
      description: 'Gerencie sua equipe com permissões personalizadas e controle total.'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Proteção máxima dos seus dados com criptografia de ponta a ponta.'
    },
    {
      icon: Zap,
      title: 'Interface Rápida',
      description: 'Sistema otimizado para máxima produtividade e facilidade de uso.'
    },
    {
      icon: Store,
      title: 'Multi-lojas',
      description: 'Gerencie várias lojas simultaneamente em um único painel central.'
    }
  ];

  const benefits = [
    'Redução de 70% no tempo de gestão',
    'Controle total do estoque em tempo real',
    'Relatórios automáticos e inteligentes',
    'Suporte 24/7 especializado'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Melhorado */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4 group">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl transform group-hover:rotate-12 transition-all duration-300">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  MKsimplo
                </span>
                <p className="text-sm text-gray-500 -mt-1">Sistema Inteligente</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section Redesenhado */}
      <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/30 py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-2 text-blue-600 font-medium shadow-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              Sistema #1 em Gestão de Estoque
            </div>

            {/* Título Principal */}
            <h1 className="text-6xl md:text-7xl font-black leading-tight">
              <span className="block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                Revolucione
              </span>
              <span className="block bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                seu Estoque
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A plataforma completa para transformar a gestão do seu negócio. 
              <strong className="text-blue-600"> Controle inteligente</strong>, 
              <strong className="text-yellow-600"> vendas otimizadas</strong> e 
              <strong className="text-blue-600"> relatórios em tempo real</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-12 py-6 rounded-2xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  🚀 Começar Grátis Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-12 py-6 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                📹 Ver Demonstração
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-gray-500">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 hover:border-blue-300 transition-all duration-300"
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Modernizada */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Seção */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-6 py-2 font-medium mb-6">
              <Zap className="h-4 w-4" />
              Recursos Poderosos
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Tudo que Você Precisa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma plataforma completa com ferramentas inteligentes para revolucionar sua gestão
            </p>
          </div>

          {/* Grid de Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="group bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="text-center p-8">
                  <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section Melhorada */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 rounded-full px-6 py-2 font-medium mb-6">
              <Star className="h-4 w-4" />
              Planos Acessíveis
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Escolha seu Plano
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções flexíveis para empresas de todos os tamanhos
            </p>
          </div>
          <PricingCards />
        </div>
      </section>

      {/* CTA Section Redesenhada */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white rounded-full px-6 py-2 font-medium">
              <Star className="h-4 w-4 text-yellow-400" />
              Milhares de Empresas Confiam
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Pronto para
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Transformar seu Negócio?
              </span>
            </h2>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Junte-se a mais de <strong className="text-yellow-400">10.000+ empresas</strong> que já revolucionaram 
              sua gestão com nossa plataforma inteligente
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-12 py-6 rounded-2xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  ✨ Começar Agora - Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="text-white/80 text-sm">
                ✅ Sem cartão de crédito • ✅ Setup em 2 minutos • ✅ Suporte completo
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
};

export default Index;
