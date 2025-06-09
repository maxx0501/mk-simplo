
import React, { useEffect, useState } from 'react';
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
import { CreateStoreForm } from '@/components/store/CreateStoreForm';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const navigate = useNavigate();
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    produtos: 0,
    vendas: 0,
    vendedores: 0,
    faturamento: 0
  });

  useEffect(() => {
    checkUserStore();
    loadStats();
  }, []);

  const checkUserStore = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      setHasStore(!!userData?.empresa_id);
    } catch (error) {
      console.error('Erro ao verificar loja:', error);
      setHasStore(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (!userData?.empresa_id) return;

      // Carregar estatísticas
      const [produtos, vendas, vendedores] = await Promise.all([
        supabase.from('produtos').select('id').eq('empresa_id', userData.empresa_id),
        supabase.from('vendas').select('valor_total').eq('empresa_id', userData.empresa_id),
        supabase.from('usuarios').select('id').eq('empresa_id', userData.empresa_id)
      ]);

      const faturamento = vendas.data?.reduce((total, venda) => total + Number(venda.valor_total), 0) || 0;

      setStats({
        produtos: produtos.data?.length || 0,
        vendas: vendas.data?.length || 0,
        vendedores: vendedores.data?.length || 0,
        faturamento
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  if (hasStore === null) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasStore) {
    return (
      <DashboardLayout>
        <CreateStoreForm />
      </DashboardLayout>
    );
  }

  const statsData = [
    {
      title: 'Total de Produtos',
      value: stats.produtos.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Faturamento',
      value: `R$ ${stats.faturamento.toFixed(2)}`,
      change: '+18%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Vendas',
      value: stats.vendas.toString(),
      change: '+5%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Vendedores',
      value: stats.vendedores.toString(),
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Bem-vindo ao seu painel de controle</p>
          </div>
          <Button 
            onClick={() => navigate('/products')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg"
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
              <Card key={index} className="bg-white border-2 border-gray-100 hover:shadow-lg transition-all duration-200 rounded-xl">
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
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 ml-4`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border-2 border-gray-100 rounded-xl">
          <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-xl">
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
                    className={`${action.color} text-white h-auto p-6 flex flex-col items-center space-y-3 hover:shadow-lg transition-all rounded-xl`}
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
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
