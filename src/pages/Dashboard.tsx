
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Package, 
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
  }, []);

  // Se o usuário não tem loja, mostrar opções de acesso
  if (!user?.store_id) {
    return (
      <DashboardLayout>
        <StoreAccessOptions />
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: 'Total de Produtos',
      value: '0',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 0,00',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pedidos Hoje',
      value: '0',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Vendedores Ativos',
      value: '0',
      change: '+0',
      changeType: 'neutral' as const,
      icon: Package,
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
      title: 'Registrar Venda',
      description: 'Registre uma nova venda',
      icon: ShoppingCart,
      action: () => navigate('/sales'),
      color: 'bg-yellow-500 hover:bg-yellow-600 text-black'
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
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
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
                        <TrendingUp className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-400 font-medium">{stat.change}</span>
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
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma venda registrada</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="bg-orange-50 border-b border-orange-100">
              <CardTitle className="text-lg text-gray-900">Produtos em Baixa</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum produto cadastrado</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
