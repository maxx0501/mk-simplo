
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Store, BarChart3, Users, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MKsimplo</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Começar grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Controle total da sua loja de roupas
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo para gestão de estoque, vendas, lucro e catálogo online. 
            Feito especialmente para lojas de pequeno porte.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
              Começar grátis agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tudo que sua loja precisa
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Controle de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gerencie produtos, entradas e alertas de estoque baixo
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Relatórios de Lucro</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Acompanhe vendas e lucro diário, semanal e mensal
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Store className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Catálogo Online</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sua loja online com link direto para WhatsApp
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Multiusuário</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Adicione vendedores com permissões específicas
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Planos que cabem no seu bolso
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Plano Gratuito</CardTitle>
                <CardDescription>Para começar</CardDescription>
                <div className="text-3xl font-bold">R$ 0</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Até 30 produtos</li>
                  <li>• Controle de estoque básico</li>
                  <li>• Registro de vendas</li>
                  <li>• 1 usuário</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                  Recomendado
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Plano Pro</CardTitle>
                <CardDescription>Para crescer</CardDescription>
                <div className="text-3xl font-bold">R$ 29,90<span className="text-lg">/mês</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Produtos ilimitados</li>
                  <li>• Catálogo online</li>
                  <li>• Relatórios avançados</li>
                  <li>• Usuários ilimitados</li>
                  <li>• Exportação de dados</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 MKsimplo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
