
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Users, BarChart3, Shield, CheckCircle, ArrowRight, ShoppingCart, UserCheck, CreditCard, Clock, Star, Zap, Package, TrendingUp, HeartHandshake, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);
  const [employeeLoginData, setEmployeeLoginData] = useState({
    storeId: '',
    login: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('authenticate_employee', {
        store_id_param: employeeLoginData.storeId,
        login_param: employeeLoginData.login,
        password_param: employeeLoginData.password
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('ID da loja, login ou senha incorretos');
      }

      const employee = data[0];
      
      // Salvar dados do vendedor no localStorage
      const userData = {
        id: employee.employee_id,
        email: employeeLoginData.login,
        role: 'employee',
        store_id: employeeLoginData.storeId,
        store_name: employee.store_name,
        employee_name: employee.employee_name
      };

      localStorage.setItem('mksimplo_user', JSON.stringify(userData));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${employee.employee_name}!`
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no login do vendedor:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Verifique as credenciais e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Store,
      title: "Gestão de Loja",
      description: "Sistema completo para gerenciar sua loja física ou virtual"
    },
    {
      icon: Users,
      title: "Equipe de Vendas",
      description: "Cadastre vendedores e acompanhe o desempenho da equipe"
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description: "Análise completa de vendas, estoque e performance"
    },
    {
      icon: Shield,
      title: "Seguro e Confiável",
      description: "Seus dados protegidos com a mais alta segurança"
    },
    {
      icon: Package,
      title: "Controle de Estoque",
      description: "Monitore produtos, quantidades e movimentações em tempo real"
    },
    {
      icon: TrendingUp,
      title: "Dashboard Inteligente",
      description: "Visualize métricas importantes e tome decisões baseadas em dados"
    },
    {
      icon: Zap,
      title: "Vendas Rápidas",
      description: "Interface otimizada para registrar vendas de forma ágil"
    },
    {
      icon: Settings,
      title: "Configurações Flexíveis",
      description: "Personalize o sistema de acordo com suas necessidades"
    }
  ];

  const benefits = [
    "✓ Controle total do estoque",
    "✓ Gestão de vendedores",
    "✓ Relatórios em tempo real",
    "✓ Interface simples e intuitiva",
    "✓ Suporte técnico dedicado",
    "✓ Backups automáticos",
    "✓ Acesso via web em qualquer lugar",
    "✓ Integração com múltiplos dispositivos"
  ];

  const pricingPlans = [
    {
      name: "Período de Teste",
      price: "Grátis",
      duration: "7 dias",
      features: [
        "Até 100 produtos",
        "2 vendedores",
        "Relatórios básicos",
        "Suporte por email"
      ],
      popular: true,
      buttonText: "Começar Teste",
      buttonVariant: "default" as const
    },
    {
      name: "Plano Pro",
      price: "R$ 49,99",
      duration: "/mês",
      features: [
        "Produtos ilimitados",
        "Vendedores ilimitados",
        "Relatórios avançados",
        "Suporte prioritário",
        "Backup automático",
        "Integrações avançadas"
      ],
      popular: false,
      buttonText: "Escolher Pro",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">MKsimplo</span>
            </div>
            <div className="flex gap-4 items-center">
              <Link to="/register">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Começar Teste
                </Button>
              </Link>
              <Button 
                variant="outline"
                onClick={() => setShowEmployeeLogin(true)}
                className="bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Login Vendedor
              </Button>
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gerencie sua loja com
            <span className="text-blue-600"> simplicidade</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistema completo para controle de estoque, vendas e equipe. 
            Tudo que você precisa para fazer sua loja crescer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Começar período de teste
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="bg-white border-gray-300 text-gray-800 hover:bg-gray-50">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Employee Login Modal */}
      {showEmployeeLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Login de Vendedor</CardTitle>
              <CardDescription>
                Entre com as credenciais fornecidas pelo proprietário da loja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmployeeLogin} className="space-y-4">
                <div>
                  <Label htmlFor="storeId">ID da Loja *</Label>
                  <Input
                    id="storeId"
                    value={employeeLoginData.storeId}
                    onChange={(e) => setEmployeeLoginData({...employeeLoginData, storeId: e.target.value})}
                    placeholder="ID fornecido pelo proprietário"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login">Login *</Label>
                  <Input
                    id="login"
                    value={employeeLoginData.login}
                    onChange={(e) => setEmployeeLoginData({...employeeLoginData, login: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={employeeLoginData.password}
                    onChange={(e) => setEmployeeLoginData({...employeeLoginData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowEmployeeLogin(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o MKsimplo?
            </h2>
            <p className="text-xl text-gray-600">
              Recursos pensados para facilitar o dia a dia da sua loja
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Planos que se adaptam ao seu negócio
            </h2>
            <p className="text-xl text-gray-600">
              Comece com o período de teste e evolua conforme sua necessidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-yellow-400 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Mais Popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="block">
                    <Button 
                      variant={plan.buttonVariant}
                      className={`w-full ${plan.popular ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : ''}`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Tudo que você precisa em um só lugar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Começar agora
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
              <div className="text-center mb-6">
                <HeartHandshake className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Suporte Dedicado
                </h3>
                <p className="text-gray-600">
                  Nossa equipe está aqui para ajudar você a ter sucesso
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">24/7</div>
                  <div className="text-xs text-gray-600">Suporte</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Equipe</div>
                  <div className="text-xs text-gray-600">Especializada</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-2xl font-bold">MKsimplo</span>
            </div>
            <p className="text-gray-400 mb-8">
              Simplifique a gestão da sua loja com tecnologia moderna
            </p>
            <Link to="/register">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
              >
                Começar agora
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
