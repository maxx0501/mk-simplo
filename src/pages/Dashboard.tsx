
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total de Produtos',
      value: '156',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 2.450',
      change: '+18%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pedidos Hoje',
      value: '23',
      change: '+5%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Vendedores Ativos',
      value: '4',
      change: '+2',
      changeType: 'positive' as const,
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
      color: 'bg-blue-600 hover:bg-blue-700'
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
      title: 'Ver Estoque',
      description: 'Monitore seu inventário atual',
      icon: Eye,
      action: () => navigate('/inventory'),
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
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
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-4`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="text-lg text-gray-900">Vendas Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Produto #{index + 1}</p>
                      <p className="text-sm text-gray-600 mt-1">Vendedor: João Silva</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-green-600">R$ {(Math.random() * 200 + 50).toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">Hoje, 14:30</p>
                    </div>
                  </div>
                ))}
                {[1, 2, 3].length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma venda registrada hoje</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="bg-orange-50 border-b border-orange-100">
              <CardTitle className="text-lg text-gray-900">Produtos em Baixa</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Produto #{index + 4}</p>
                      <p className="text-sm text-gray-600 mt-1">SKU: PRD00{index + 4}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-red-600">{Math.floor(Math.random() * 10 + 1)} unidades</p>
                      <p className="text-xs text-gray-500 mt-1">Restantes</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
