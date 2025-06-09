
import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  ShoppingCart,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const salesData = [
  { month: 'Jan', vendas: 2400 },
  { month: 'Fev', vendas: 1398 },
  { month: 'Mar', vendas: 9800 },
  { month: 'Abr', vendas: 3908 },
  { month: 'Mai', vendas: 4800 },
  { month: 'Jun', vendas: 3800 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
  }, []);

  // Se o usuário não tem loja, mostrar opções de acesso
  if (!user?.store_id) {
    return (
      <ModernDashboardLayout>
        <StoreAccessOptions />
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-dark-blue">
              Bem-vindo, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Aqui está o resumo do seu negócio hoje
            </p>
          </div>
          <Button className="btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Nova Venda
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Vendas Hoje"
            value="R$ 2.350"
            icon={DollarSign}
            change="+12% desde ontem"
            trend="up"
          />
          <StatsCard
            title="Produtos em Estoque"
            value="1.247"
            icon={Package}
            change="23 produtos baixos"
            trend="down"
          />
          <StatsCard
            title="Vendedores Ativos"
            value="8"
            icon={Users}
            change="2 vendas hoje"
            trend="up"
          />
          <StatsCard
            title="Ticket Médio"
            value="R$ 156"
            icon={TrendingUp}
            change="+5% este mês"
            trend="up"
          />
        </div>

        {/* Charts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-dark-blue">Vendas Mensais</CardTitle>
              <CardDescription>
                Evolução das vendas nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${value}`, 'Vendas']}
                    labelStyle={{ color: '#1E2A38' }}
                  />
                  <Bar dataKey="vendas" fill="hsl(var(--golden))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-dark-blue">Ações Rápidas</CardTitle>
              <CardDescription>
                Acesso rápido às funcionalidades principais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start bg-white border-2 border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white"
                onClick={() => navigate('/sales')}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Registrar Nova Venda
              </Button>
              <Button 
                className="w-full justify-start bg-white border-2 border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white"
                onClick={() => navigate('/products')}
              >
                <Package className="w-5 h-5 mr-3" />
                Adicionar Produto
              </Button>
              <Button 
                className="w-full justify-start bg-white border-2 border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white"
                onClick={() => navigate('/users')}
              >
                <Users className="w-5 h-5 mr-3" />
                Gerenciar Vendedores
              </Button>
              <Button 
                className="w-full justify-start bg-white border-2 border-golden text-golden hover:bg-golden hover:text-black"
                onClick={() => navigate('/reports')}
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="card-modern border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alertas do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-orange-700">
                • 23 produtos com estoque baixo - verificar reposição
              </p>
              <p className="text-orange-700">
                • Backup automático realizado com sucesso às 03:00
              </p>
              <p className="text-orange-700">
                • 2 vendedores não registraram vendas hoje
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernDashboardLayout>
  );
}
