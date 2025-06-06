
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
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Usuários Ativos',
      value: '45',
      change: '+8%',
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
      title: 'Ver Relatórios',
      description: 'Analise o desempenho do seu negócio',
      icon: BarChart3,
      action: () => navigate('/reports'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Gerenciar Vendas',
      description: 'Acompanhe e gerencie suas vendas',
      icon: ShoppingCart,
      action: () => navigate('/sales'),
      color: 'bg-yellow-600 hover:bg-yellow-700'
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-black">Dashboard</h1>
              <p className="text-gray-600 mt-2 text-lg">Bem-vindo ao seu painel de controle</p>
            </div>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
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
                <Card key={index} className="shadow-lg border-0 bg-white hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-black mt-2">{stat.value}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-black text-2xl">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      onClick={action.action}
                      className={`${action.color} text-white h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-lg transition-all`}
                    >
                      <Icon className="w-8 h-8" />
                      <div className="text-center">
                        <p className="font-semibold">{action.title}</p>
                        <p className="text-xs opacity-90">{action.description}</p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="text-black">Vendas Recentes</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-black">Produto #{index + 1}</p>
                        <p className="text-sm text-gray-600">Cliente Exemplo</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-black">R$ {(Math.random() * 200 + 50).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Hoje</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                <CardTitle className="text-black">Produtos em Baixa</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-black">Produto #{index + 4}</p>
                        <p className="text-sm text-gray-600">SKU: PRD00{index + 4}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{Math.floor(Math.random() * 10 + 1)} unidades</p>
                        <p className="text-xs text-gray-500">Restantes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
