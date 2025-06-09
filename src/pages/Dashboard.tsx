
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Users, 
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    todayOrders: 0,
    totalRevenue: 0
  });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.store_id) {
      fetchDashboardData(userData.store_id);
    }
  }, []);

  const fetchDashboardData = async (storeId: string) => {
    try {
      // Buscar produtos
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId);

      // Buscar vendas
      const { data: sales } = await supabase
        .from('sales')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      // Vendas de hoje
      const today = new Date().toISOString().split('T')[0];
      const todaySales = sales?.filter(sale => 
        sale.created_at.startsWith(today)
      ) || [];

      // Calcular receita total
      const totalRevenue = sales?.reduce((sum, sale) => sum + Number(sale.product_value), 0) || 0;

      // Produtos com estoque baixo (menos de 10 unidades)
      const lowStock = products?.filter(product => product.stock_quantity < 10) || [];

      setStats({
        totalProducts: products?.length || 0,
        totalSales: sales?.length || 0,
        todayOrders: todaySales.length,
        totalRevenue
      });

      setRecentSales(sales?.slice(0, 3) || []);
      setLowStockProducts(lowStock.slice(0, 3));

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    }
  };

  // Se o usuário não tem loja, mostrar opções de acesso
  if (!user?.store_id) {
    return (
      <DashboardLayout>
        <StoreAccessOptions />
      </DashboardLayout>
    );
  }

  const statsData = [
    {
      title: 'Total de Produtos',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Vendas Hoje',
      value: stats.todayOrders.toString(),
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total de Vendas',
      value: stats.totalSales.toString(),
      icon: TrendingUp,
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
      title: 'Nova Venda',
      description: 'Registre uma nova venda',
      icon: ShoppingCart,
      action: () => navigate('/sales'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Ver Relatórios',
      description: 'Analise o desempenho do seu negócio',
      icon: TrendingUp,
      action: () => navigate('/reports'),
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      title: 'Gerenciar Vendedores',
      description: 'Adicione e gerencie vendedores',
      icon: Users,
      action: () => navigate('/users'),
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
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="shadow-lg border-0 bg-white hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-black mt-2">{stat.value}</p>
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
                  {recentSales.length > 0 ? (
                    recentSales.map((sale, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-black">{sale.product_name}</p>
                          <p className="text-sm text-gray-600">{sale.employee_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black">R$ {Number(sale.product_value).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(sale.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhuma venda registrada</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                <CardTitle className="text-black">Produtos em Baixa</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-black">{product.name}</p>
                          <p className="text-sm text-gray-600">SKU: {product.sku || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">{product.stock_quantity} unidades</p>
                          <p className="text-xs text-gray-500">Restantes</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Todos os produtos com estoque adequado</p>
                  )}
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
