
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Store, BarChart3, Users, Package, Check, Star, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  const handleStartFree = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/register';
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
      window.location.href = '/register';
    }
  };

  const handleSubscribePro = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Você precisa fazer login para assinar um plano",
          variant: "destructive"
        });
        window.location.href = '/login';
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan_type: 'pro' }
      });

      if (error) {
        console.error('Erro na função create-checkout:', error);
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (error: any) {
      console.error('Erro ao criar checkout:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar pagamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MKsimplo
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline" className="hover:bg-blue-50">Entrar</Button>
              </Link>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                onClick={handleStartFree}
              >
                Começar grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Controle total da sua
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                loja de roupas
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Sistema completo para gestão de estoque, vendas, lucro e catálogo online. 
              Feito especialmente para lojas de pequeno porte que querem crescer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all"
                onClick={handleStartFree}
              >
                <Zap className="mr-2 h-5 w-5" />
                Começar teste grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">
                <Check className="inline h-4 w-4 text-green-500 mr-1" />
                7 dias grátis • Sem cartão de crédito
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Tudo que sua loja precisa
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simplifique a gestão da sua loja com ferramentas profissionais e intuitivas
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Controle de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-700">
                  Gerencie produtos, entradas e alertas de estoque baixo em tempo real
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-900">Relatórios de Lucro</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-green-700">
                  Acompanhe vendas e lucro diário, semanal e mensal com gráficos detalhados
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-900">Catálogo Online</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-purple-700">
                  Sua loja online personalizada com link direto para WhatsApp
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-orange-900">Multiusuário</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-orange-700">
                  Adicione vendedores com permissões específicas para cada função
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Planos que cabem no seu bolso
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comece grátis e evolua conforme sua loja cresce
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-900">Período de Teste</CardTitle>
                <CardDescription className="text-green-700">7 dias grátis para conhecer</CardDescription>
                <div className="text-3xl font-bold text-green-600">Grátis</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Acesso completo por 7 dias
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Produtos ilimitados
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Relatórios básicos
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Suporte por email
                  </li>
                </ul>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleStartFree}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Começar teste grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-600 relative shadow-xl">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Recomendado
                </span>
              </div>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-900">Plano Pro</CardTitle>
                <CardDescription className="text-purple-700">Para fazer sua loja crescer</CardDescription>
                <div className="text-3xl font-bold text-purple-600">
                  R$ 1,00<span className="text-lg">/mês</span>
                  <div className="text-sm text-gray-500 line-through">R$ 29,90</div>
                  <div className="text-xs text-purple-600 font-normal">PREÇO DE TESTE</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-purple-500 mr-2" />
                    Produtos ilimitados
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-purple-500 mr-2" />
                    Catálogo online personalizado
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-purple-500 mr-2" />
                    Relatórios avançados
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-purple-500 mr-2" />
                    Usuários ilimitados
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-purple-500 mr-2" />
                    Suporte prioritário 24/7
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-purple-500 mr-2" />
                    Exportação de dados
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  onClick={handleSubscribePro}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Assinar Plano Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "O MKsimplo revolucionou minha loja. Agora tenho controle total do estoque e vendas!"
                </p>
                <div className="font-medium text-gray-900">Maria Silva</div>
                <div className="text-sm text-gray-500">Loja Bella Moda</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Sistema muito fácil de usar. Meus vendedores aprenderam em poucos minutos!"
                </p>
                <div className="font-medium text-gray-900">João Santos</div>
                <div className="text-sm text-gray-500">Fashion Store</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Os relatórios me ajudam a tomar decisões mais inteligentes sobre compras e vendas."
                </p>
                <div className="font-medium text-gray-900">Ana Costa</div>
                <div className="text-sm text-gray-500">Style Plus</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">
              Pronto para transformar sua loja?
            </h3>
            <p className="text-xl mb-8 text-blue-100">
              Junte-se a centenas de lojistas que já usam o MKsimplo para gerenciar suas vendas
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg"
              onClick={handleStartFree}
            >
              <Zap className="mr-2 h-5 w-5" />
              Começar agora grátis
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Store className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">MKsimplo</span>
              </div>
              <p className="text-gray-400">
                A solução completa para gestão de lojas de roupas
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Funcionalidades</li>
                <li>Preços</li>
                <li>Suporte</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre nós</li>
                <li>Blog</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacidade</li>
                <li>Termos</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MKsimplo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
