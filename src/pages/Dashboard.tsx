
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, AlertTriangle, DollarSign, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
  }, []);

  // Dados simulados (viria do Supabase)
  const stats = {
    totalProducts: 45,
    lowStockProducts: 3,
    todaySales: 8,
    todayProfit: 245.50
  };

  const lowStockItems = [
    { name: 'Camiseta Básica Preta', stock: 2, minStock: 5 },
    { name: 'Calça Jeans Skinny', stock: 1, minStock: 3 },
    { name: 'Vestido Floral', stock: 0, minStock: 2 }
  ];

  const recentSales = [
    { product: 'Blusa Listrada', quantity: 2, value: 89.90, time: '14:30' },
    { product: 'Saia Midi', quantity: 1, value: 65.00, time: '13:15' },
    { product: 'Conjunto Moletom', quantity: 1, value: 120.00, time: '11:45' }
  ];

  // Se o usuário não tem loja, mostrar tela de criação
  if (!user?.store_id) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Store className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Bem-vindo ao MKsimplo!</CardTitle>
              <CardDescription>
                Você ainda não tem uma loja cadastrada. Crie sua primeira loja para começar a usar o sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/settings')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Criar Minha Primeira Loja
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Você pode criar sua loja nas configurações do sistema
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral da sua loja</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                cadastrados no sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                produtos precisam reposição
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.todaySales}</div>
              <p className="text-xs text-muted-foreground">
                itens vendidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                R$ {stats.todayProfit.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% que ontem
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Recent Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                Produtos com Estoque Baixo
              </CardTitle>
              <CardDescription>
                Produtos que precisam de reposição urgente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Estoque atual: {item.stock} (mín: {item.minStock})
                      </p>
                    </div>
                    <Badge variant={item.stock === 0 ? "destructive" : "outline"}>
                      {item.stock === 0 ? "Esgotado" : "Baixo"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas Recentes</CardTitle>
              <CardDescription>
                Últimas vendas realizadas hoje
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSales.map((sale, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{sale.product}</p>
                      <p className="text-sm text-gray-600">
                        {sale.quantity}x - {sale.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        R$ {sale.value.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Status */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Status do Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-800">Plano Gratuito</p>
                <p className="text-sm text-blue-600">
                  {stats.totalProducts}/30 produtos utilizados
                </p>
              </div>
              <Badge className="bg-blue-600">
                Assinar Plano Pro
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
