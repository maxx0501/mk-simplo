
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
  UserCheck,
  Crown,
  Zap
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-royal-blue" />
              <span className="ml-2 text-2xl font-bold text-gray-900">MK Simplo</span>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/employee-login')} 
                className="border-royal-blue text-royal-blue hover:bg-blue-50 rounded-lg"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Login Vendedor
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')} 
                className="border-royal-blue text-royal-blue hover:bg-blue-50 rounded-lg"
              >
                Entrar
              </Button>
              <Button 
                onClick={() => navigate('/register')} 
                className="btn-accent rounded-lg px-6"
              >
                Começar Teste Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Controle Total do Seu
              <span className="text-royal-blue"> Negócio</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gerencie vendas, estoque, equipe e relatórios em uma plataforma simples e poderosa.
              Comece seu período de teste gratuito hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="btn-accent text-lg px-8 py-4 rounded-xl"
              >
                Começar Período de Teste
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/employee-login')}
                className="text-lg px-8 py-4 border-royal-blue text-royal-blue hover:bg-blue-50 rounded-xl"
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
                <Card key={index} className="card-modern text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-royal-blue" />
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
            <Card className="card-modern">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Período Gratuito</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">Grátis</span>
                  <span className="text-xl text-gray-600"> / 7 dias</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Até 3 vendedores</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Relatórios básicos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Suporte por email</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Gestão de estoque</span>
                  </li>
                </ul>
                <Button 
                  className="w-full py-3 btn-primary rounded-lg"
                  onClick={() => navigate('/register')}
                >
                  Começar Teste Grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="card-modern ring-2 ring-golden-yellow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-golden-yellow text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                  <Crown className="w-4 h-4 mr-1" />
                  Mais Popular
                </span>
              </div>
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Plano Premium</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">R$ 49</span>
                  <span className="text-xl text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Vendedores ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Relatórios avançados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Gestão completa</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Backups automáticos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Integrações avançadas</span>
                  </li>
                </ul>
                <Button 
                  className="w-full py-3 btn-accent rounded-lg"
                  onClick={() => navigate('/register')}
                >
                  Escolher Plano Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-royal-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para revolucionar seu negócio?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a centenas de empresários que já escolheram o MK Simplo
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="btn-accent text-lg px-8 py-4 rounded-xl"
          >
            Começar Agora - 7 Dias Grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Store className="h-8 w-8 text-golden-yellow" />
                <span className="ml-2 text-2xl font-bold">MK Simplo</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                A plataforma completa para gestão do seu negócio. 
                Simplifique suas operações e acelere seu crescimento.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white rounded-lg">
                  Sobre nós
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white rounded-lg">
                  Blog
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2024 MK Simplo. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
