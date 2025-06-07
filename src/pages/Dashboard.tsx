
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingCart,
  DollarSign,
  Users,
  Plus,
  BarChart3,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total de Produtos',
      value: '0',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 0,00',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Vendas Hoje',
      value: '0',
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Vendedores Ativos',
      value: '0',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const quickActions = [
    {
      title: 'Adicionar Produto',
      description: 'Cadastre um novo produto no estoque',
      icon: Plus,
      action: () => navigate('/products'),
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      title: 'Gerenciar Vendedores',
      description: 'Adicione ou gerencie sua equipe',
      icon: Users,
      action: () => navigate('/employees'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Ver Relatórios',
      description: 'Analise o desempenho do seu negócio',
      icon: BarChart3,
      action: () => navigate('/reports'),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      title: 'Registrar Venda',
      description: 'Registre uma nova venda',
      icon: ShoppingCart,
      action: () => navigate('/sales'),
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Bem-vindo ao seu painel de controle</p>
          </div>
          <Button 
            onClick={() => navigate('/products')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-3">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-4`}>
                      <Icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <CardTitle className="text-xl text-gray-900">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white h-auto p-6 flex flex-col items-center space-y-3 hover:shadow-lg transition-all`}
                  >
                    <Icon className="w-8 h-8" />
                    <div className="text-center">
                      <p className="font-semibold text-sm">{action.title}</p>
                      <p className="text-xs opacity-90 mt-1">{action.description}</p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Empty State Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="bg-green-50 border-b border-green-100 px-6 py-4">
              <CardTitle className="text-lg text-gray-900">Vendas Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhuma venda registrada ainda</p>
                <Button 
                  onClick={() => navigate('/sales')} 
                  className="mt-4 bg-green-600 hover:bg-green-700"
                >
                  Registrar Primeira Venda
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="bg-orange-50 border-b border-orange-100 px-6 py-4">
              <CardTitle className="text-lg text-gray-900">Produtos em Estoque</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhum produto cadastrado ainda</p>
                <Button 
                  onClick={() => navigate('/products')} 
                  className="mt-4 bg-orange-600 hover:bg-orange-700"
                >
                  Adicionar Primeiro Produto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
