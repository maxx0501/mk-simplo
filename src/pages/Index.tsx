
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  BarChart3, 
  Users, 
  Shield, 
  CheckCircle, 
  Star,
  ArrowRight,
  UserCheck
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Store,
      title: 'Gestão Completa',
      description: 'Controle total do seu negócio em uma única plataforma'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Detalhados',
      description: 'Analise o desempenho e tome decisões baseadas em dados'
    },
    {
      icon: Users,
      title: 'Equipe de Vendas',
      description: 'Gerencie vendedores e acompanhe o desempenho individual'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com a melhor tecnologia disponível'
    }
  ];

  const plans = [
    {
      name: 'Período de Teste',
      price: 'Grátis',
      period: '7 dias',
      features: [
        'Até 3 vendedores',
        'Relatórios básicos',
        'Suporte por email',
        'Gestão de estoque'
      ],
      popular: false,
      action: () => navigate('/register')
    },
    {
      name: 'Plano Pro',
      price: 'R$ 29,90',
      period: '/mês',
      features: [
        'Vendedores ilimitados',
        'Relatórios avançados',
        'Suporte prioritário',
        'Gestão completa',
        'Backups automáticos',
        'Integrações avançadas'
      ],
      popular: true,
      action: () => navigate('/register')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-yellow-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">MK Simplo</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => navigate('/employee-login')}>
                <UserCheck className="w-4 h-4 mr-2" />
                Login Vendedor
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/register')} className="bg-yellow-600 hover:bg-yellow-700">
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Controle Total do Seu
              <span className="text-yellow-600"> Negócio</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gerencie vendas, estoque, equipe e relatórios em uma plataforma simples e poderosa.
              Comece seu período de teste gratuito hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-yellow-600 hover:bg-yellow-700 text-lg px-8 py-4"
              >
                Começar Período de Teste
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/employee-login')}
                className="text-lg px-8 py-4"
              >
                <UserCheck className="mr-2 h-5 w-5" />
                Acesso para Vendedores
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para crescer
            </h2>
            <p className="text-xl text-gray-600">
              Funcionalidades pensadas para simplificar a gestão do seu negócio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos Simples e Transparentes
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis e escale conforme seu negócio cresce
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-yellow-500 shadow-xl' : 'shadow-lg'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xl text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full py-3 ${plan.popular ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                    onClick={plan.action}
                  >
                    {plan.name === 'Período de Teste' ? 'Começar Teste Grátis' : 'Escolher Plano Pro'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para revolucionar seu negócio?
          </h2>
          <p className="text-xl text-yellow-100 mb-8">
            Junte-se a centenas de empresários que já escolheram o MK Simplo
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="bg-white text-yellow-600 hover:bg-gray-50 text-lg px-8 py-4"
          >
            Começar Agora - 7 Dias Grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Store className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-2xl font-bold">MK Simplo</span>
            </div>
            <div className="text-gray-400">
              © 2024 MK Simplo. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
