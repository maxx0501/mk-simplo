
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingCart,
  DollarSign,
  Users,
  Plus,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    monthSales: 0,
    todaySales: 0,
    activeEmployees: 0
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
    if (userData?.store_id) {
      loadStats(userData.store_id);
    }
  }, []);

  const loadStats = async (storeId: string) => {
    try {
      // Carregar produtos
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('store_id', storeId);

      // Carregar vendas do mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthSalesData } = await supabase
        .from('sales')
        .select('product_value')
        .eq('store_id', storeId)
        .gte('sale_date', startOfMonth.toISOString());

      // Carregar vendas de hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: todaySalesData } = await supabase
        .from('sales')
        .select('id')
        .eq('store_id', storeId)
        .gte('sale_date', today.toISOString());

      // Carregar funcionários
      const { data: employees } = await supabase
        .from('store_employees')
        .select('id')
        .eq('store_id', storeId);

      const monthSalesTotal = monthSalesData?.reduce((sum, sale) => sum + Number(sale.product_value), 0) || 0;

      setStats({
        totalProducts: products?.length || 0,
        monthSales: monthSalesTotal,
        todaySales: todaySalesData?.length || 0,
        activeEmployees: employees?.length || 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const statsData = [
    {
      title: 'Total de Produtos',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Vendas do Mês',
      value: `R$ ${stats.monthSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Vendas Hoje',
      value: stats.todaySales.toString(),
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Vendedores Ativos',
      value: stats.activeEmployees.toString(),
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

  if (!user?.store_id) {
    return (
      <DashboardLayout>
        <StoreAccessOptions />
      </DashboardLayout>
    );
  }

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
          {statsData.map((stat, index) => {
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="bg-green-50 border-b border-green-100 px-6 py-4">
              <CardTitle className="text-lg text-gray-900">Vendas Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {stats.todaySales === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Nenhuma venda registrada hoje</p>
                  <Button 
                    onClick={() => navigate('/sales')} 
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Registrar Venda
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg font-semibold text-green-600">{stats.todaySales} vendas hoje</p>
                  <Button 
                    onClick={() => navigate('/sales')} 
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Ver Todas as Vendas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="bg-orange-50 border-b border-orange-100 px-6 py-4">
              <CardTitle className="text-lg text-gray-900">Produtos em Estoque</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {stats.totalProducts === 0 ? (
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg font-semibold text-orange-600">{stats.totalProducts} produtos cadastrados</p>
                  <Button 
                    onClick={() => navigate('/products')} 
                    className="mt-4 bg-orange-600 hover:bg-orange-700"
                  >
                    Gerenciar Produtos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
