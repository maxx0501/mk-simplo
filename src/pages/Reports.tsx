
import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, DollarSign, Package, Users, Calendar, Download, BarChart3, PieChart } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface SalesData {
  date: string;
  total: number;
  quantity: number;
}

interface ProductSales {
  name: string;
  total: number;
  quantity: number;
}

const COLORS = ['#007BFF', '#FFD700', '#28A745', '#FD7E14', '#6F42C1', '#E83E8C'];

export default function Reports() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('30');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [averageTicket, setAverageTicket] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.store_id) {
      fetchReports(userData.store_id, period);
    }
  }, [period]);

  const fetchReports = async (storeId: string, days: string) => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      // Buscar vendas do período
      const { data: sales, error } = await supabase
        .from('sales')
        .select('*')
        .eq('store_id', storeId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Processar dados para gráficos
      const salesByDate: { [key: string]: { total: number; quantity: number } } = {};
      const salesByProduct: { [key: string]: { total: number; quantity: number } } = {};
      
      let totalRevenue = 0;
      let totalQuantity = 0;

      (sales || []).forEach((sale: any) => {
        const date = new Date(sale.created_at).toLocaleDateString('pt-BR');
        
        // Vendas por data
        if (!salesByDate[date]) {
          salesByDate[date] = { total: 0, quantity: 0 };
        }
        salesByDate[date].total += sale.total_amount;
        salesByDate[date].quantity += sale.quantity;

        // Vendas por produto
        if (!salesByProduct[sale.product_name]) {
          salesByProduct[sale.product_name] = { total: 0, quantity: 0 };
        }
        salesByProduct[sale.product_name].total += sale.total_amount;
        salesByProduct[sale.product_name].quantity += sale.quantity;

        totalRevenue += sale.total_amount;
        totalQuantity += sale.quantity;
      });

      // Converter para arrays para os gráficos
      const chartSalesData = Object.entries(salesByDate).map(([date, data]) => ({
        date,
        total: data.total,
        quantity: data.quantity
      }));

      const chartProductData = Object.entries(salesByProduct)
        .map(([name, data]) => ({
          name,
          total: data.total,
          quantity: data.quantity
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5); // Top 5 produtos

      setSalesData(chartSalesData);
      setProductSales(chartProductData);
      setTotalSales(totalRevenue);
      setTotalItems(totalQuantity);
      setAverageTicket(sales?.length ? totalRevenue / sales.length : 0);

    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os relatórios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="space-y-8 p-6">
        {/* Header melhorado */}
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 p-8 rounded-3xl border border-blue-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-3">
                📊 Relatórios
              </h1>
              <p className="text-gray-600 text-lg">Análise detalhada do seu negócio</p>
            </div>
            <div className="flex gap-4">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-48 h-12 border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">📅 Últimos 7 dias</SelectItem>
                  <SelectItem value="30">📅 Últimos 30 dias</SelectItem>
                  <SelectItem value="90">📅 Últimos 90 dias</SelectItem>
                  <SelectItem value="365">📅 Último ano</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline"
                className="h-12 px-6 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                📥 Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium mb-1">💰 Faturamento Total</p>
                  <p className="text-3xl font-bold text-green-700">R$ {totalSales.toFixed(2)}</p>
                  <p className="text-sm text-green-600 mt-1">Últimos {period} dias</p>
                </div>
                <div className="bg-green-200 p-3 rounded-xl">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium mb-1">📦 Itens Vendidos</p>
                  <p className="text-3xl font-bold text-blue-700">{totalItems}</p>
                  <p className="text-sm text-blue-600 mt-1">Unidades</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-xl">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-medium mb-1">🎯 Ticket Médio</p>
                  <p className="text-3xl font-bold text-purple-700">R$ {averageTicket.toFixed(2)}</p>
                  <p className="text-sm text-purple-600 mt-1">Por venda</p>
                </div>
                <div className="bg-purple-200 p-3 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Vendas por Data */}
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                📈 Vendas por Data
              </CardTitle>
              <CardDescription className="text-blue-100">
                Evolução das vendas no período
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'total' ? `R$ ${value}` : value,
                        name === 'total' ? 'Faturamento' : 'Quantidade'
                      ]}
                      labelStyle={{ color: '#1f2937' }}
                      contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Bar dataKey="total" fill="#007BFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-500">
                  📊 Nenhum dado de vendas encontrado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Top Produtos */}
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-6 rounded-t-2xl">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                🏆 Top 5 Produtos
              </CardTitle>
              <CardDescription className="text-yellow-800">
                Produtos mais vendidos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                </div>
              ) : productSales.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip 
                      formatter={(value) => [`R$ ${value}`, 'Faturamento']}
                      contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Cell>
                      {productSales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Cell>
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-500">
                  🥧 Nenhum dado de produtos encontrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Top Produtos */}
        {productSales.length > 0 && (
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <CardTitle className="text-xl font-bold">🏆 Ranking de Produtos</CardTitle>
              <CardDescription className="text-purple-100">
                Detalhamento dos produtos mais vendidos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {productSales.map((product, index) => (
                  <div 
                    key={product.name}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.quantity} unidades vendidas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">R$ {product.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Faturamento</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ModernDashboardLayout>
  );
}
