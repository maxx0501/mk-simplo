
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Store, ShoppingCart, BarChart3, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-yellow-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">MK Simplo</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
              >
                Entrar
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Registrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
              <div>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Gerencie sua</span>
                  <span className="block text-yellow-600">loja com simplicidade</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Sistema completo para gerenciar vendas, produtos, estoque e vendedores. 
                  Tudo que você precisa para fazer sua loja crescer.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 text-lg rounded-lg font-semibold"
                  >
                    Começar Agora - Grátis
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Card className="w-full bg-white shadow-xl border-yellow-200 lg:self-center">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <ShoppingCart className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Controle de Vendas</h3>
                        <p className="text-gray-500">Registre e acompanhe todas as vendas</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <Store className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Gestão de Produtos</h3>
                        <p className="text-gray-500">Organize seu catálogo e estoque</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Equipe de Vendas</h3>
                        <p className="text-gray-500">Gerencie vendedores e comissões</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Relatórios</h3>
                        <p className="text-gray-500">Analise performance e resultados</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Tudo que você precisa para gerenciar sua loja
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Funcionalidades completas para pequenos e médios negócios
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-yellow-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Vendas Rápidas</h3>
                  <p className="text-gray-500">Registre vendas de forma rápida e prática, com histórico completo.</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Store className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Controle de Estoque</h3>
                  <p className="text-gray-500">Gerencie produtos, preços e quantidades em estoque.</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipe de Vendas</h3>
                  <p className="text-gray-500">Cadastre vendedores e acompanhe performance individual.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-lg text-yellow-100">
            Crie sua conta gratuita e comece a gerenciar sua loja hoje mesmo.
          </p>
          <div className="mt-8">
            <Button 
              onClick={() => navigate('/register')}
              className="bg-white text-yellow-600 hover:bg-gray-50 px-8 py-4 text-lg rounded-lg font-semibold"
            >
              Criar Conta Gratuita
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="flex items-center">
              <Store className="h-6 w-6 text-yellow-400" />
              <span className="ml-2 text-xl font-bold text-white">MK Simplo</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-400">© 2024 MK Simplo. Sistema de gestão para lojas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
