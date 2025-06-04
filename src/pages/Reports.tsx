
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users 
} from 'lucide-react';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  // Mock data para os gráficos
  const salesData = [
    { month: 'Jan', vendas: 4000, produtos: 240 },
    { month: 'Fev', vendas: 3000, produtos: 139 },
    { month: 'Mar', vendas: 2000, produtos: 980 },
    { month: 'Abr', vendas: 2780, produtos: 390 },
    { month: 'Mai', vendas: 1890, produtos: 480 },
    { month: 'Jun', vendas: 2390, produtos: 380 },
  ];

  const categoryData = [
    { name: 'Eletrônicos', value: 400, color: '#8884d8' },
    { name: 'Roupas', value: 300, color: '#82ca9d' },
    { name: 'Casa', value: 200, color: '#ffc658' },
    { name: 'Esportes', value: 100, color: '#ff7c7c' },
  ];

  const dailySales = [
    { day: 'Seg', vendas: 120 },
    { day: 'Ter', vendas: 190 },
    { day: 'Qua', vendas: 300 },
    { day: 'Qui', vendas: 500 },
    { day: 'Sex', vendas: 200 },
    { day: 'Sáb', vendas: 280 },
    { day: 'Dom', vendas: 180 },
  ];

  const topProducts = [
    { id: 1, name: 'iPhone 15', sales: 45, revenue: 'R$ 67.500' },
    { id: 2, name: 'Samsung Galaxy', sales: 38, revenue: 'R$ 45.600' },
    { id: 3, name: 'Notebook Dell', sales: 22, revenue: 'R$ 35.200' },
    { id: 4, name: 'Mouse Gamer', sales: 67, revenue: 'R$ 6.700' },
    { id: 5, name: 'Teclado Mecânico', sales: 34, revenue: 'R$ 5.100' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-500">Análise de desempenho da sua loja</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.231</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +20.1% em relação ao mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.234</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% em relação ao mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">567</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2% em relação ao mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.1% em relação ao mês anterior
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendas Mensais */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas Mensais</CardTitle>
              <CardDescription>
                Comparativo de vendas e produtos vendidos por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vendas" fill="#8884d8" name="Vendas (R$)" />
                  <Bar dataKey="produtos" fill="#82ca9d" name="Produtos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vendas por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Categoria</CardTitle>
              <CardDescription>
                Distribuição de vendas por categoria de produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Vendas Diárias e Top Produtos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendas Diárias */}
          <Card>
            <CardHeader>
              <CardTitle>Vendas da Semana</CardTitle>
              <CardDescription>
                Desempenho de vendas por dia da semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Vendas (R$)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Produtos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>
                Os 5 produtos com melhor desempenho no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} vendas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights e Recomendações */}
        <Card>
          <CardHeader>
            <CardTitle>Insights e Recomendações</CardTitle>
            <CardDescription>
              Análises automatizadas baseadas nos seus dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-blue-800 font-medium">Crescimento Positivo</p>
                </div>
                <p className="text-blue-700 mt-1">
                  Suas vendas cresceram 20% este mês. Continue investindo em marketing digital.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-800 font-medium">Atenção ao Estoque</p>
                </div>
                <p className="text-yellow-700 mt-1">
                  3 produtos estão com estoque baixo. Considere reabastecer em breve.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-green-800 font-medium">Oportunidade de Upsell</p>
                </div>
                <p className="text-green-700 mt-1">
                  Eletrônicos têm boa margem de lucro. Considere criar pacotes promocionais.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
