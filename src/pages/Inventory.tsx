
import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Archive, AlertTriangle, Package, TrendingDown, TrendingUp, Search, Filter, RefreshCw } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  stock_quantity: number;
  price: number;
  cost: number;
}

export default function Inventory() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.store_id) {
      fetchProducts(userData.store_id);
    }
  }, []);

  const fetchProducts = async (storeId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, stock_quantity, price, cost')
        .eq('store_id', storeId)
        .order('stock_quantity', { ascending: true });

      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar o estoque",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      toast({
        title: "❌ Erro",
        description: "Quantidade não pode ser negativa",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "✅ Sucesso",
        description: "Estoque atualizado com sucesso!"
      });

      fetchProducts(user.store_id);
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar o estoque",
        variant: "destructive"
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filterBy) {
      case 'low':
        return matchesSearch && product.stock_quantity < 10;
      case 'out':
        return matchesSearch && product.stock_quantity === 0;
      case 'normal':
        return matchesSearch && product.stock_quantity >= 10;
      default:
        return matchesSearch;
    }
  });

  const lowStockCount = products.filter(p => p.stock_quantity < 10).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;
  const totalProducts = products.length;
  const totalStockValue = products.reduce((acc, product) => acc + (product.stock_quantity * product.cost), 0);

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
                📦 Controle de Estoque
              </h1>
              <p className="text-gray-600 text-lg">Monitore e gerencie seu inventário</p>
            </div>
            <Button 
              onClick={() => fetchProducts(user.store_id)}
              disabled={loading}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              🔄 Atualizar
            </Button>
          </div>
        </div>

        {/* Estatísticas do Estoque */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium mb-1">📊 Total de Produtos</p>
                  <p className="text-3xl font-bold text-blue-700">{totalProducts}</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-xl">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 font-medium mb-1">⚠️ Estoque Baixo</p>
                  <p className="text-3xl font-bold text-red-700">{lowStockCount}</p>
                </div>
                <div className="bg-red-200 p-3 rounded-xl">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 font-medium mb-1">❌ Sem Estoque</p>
                  <p className="text-3xl font-bold text-orange-700">{outOfStockCount}</p>
                </div>
                <div className="bg-orange-200 p-3 rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium mb-1">💰 Valor do Estoque</p>
                  <p className="text-2xl font-bold text-green-700">R$ {totalStockValue.toFixed(2)}</p>
                </div>
                <div className="bg-green-200 p-3 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="🔍 Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-64 h-12 border-gray-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">📊 Todos os produtos</SelectItem>
                <SelectItem value="low">⚠️ Estoque baixo (&lt;10)</SelectItem>
                <SelectItem value="out">❌ Sem estoque</SelectItem>
                <SelectItem value="normal">✅ Estoque normal (≥10)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de Produtos */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-4">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id}
                className={`rounded-2xl shadow-xl border transition-all duration-300 transform hover:scale-105 ${
                  product.stock_quantity === 0
                    ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
                    : product.stock_quantity < 10
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
                    : 'bg-white border-gray-100'
                } hover:shadow-2xl`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center">
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-xl text-gray-800 mb-2 flex items-center gap-2">
                        📦 {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {product.stock_quantity === 0 && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            ❌ Sem Estoque
                          </span>
                        )}
                        {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            ⚠️ Estoque Baixo
                          </span>
                        )}
                        {product.stock_quantity >= 10 && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            ✅ OK
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">📊 Estoque Atual</p>
                      <p className={`text-2xl font-bold ${
                        product.stock_quantity === 0 ? 'text-red-600' :
                        product.stock_quantity < 10 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {product.stock_quantity}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">💰 Preço</p>
                      <p className="text-lg font-medium text-gray-800">R$ {product.price.toFixed(2)}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">💵 Valor Total</p>
                      <p className="text-lg font-bold text-blue-600">
                        R$ {(product.stock_quantity * product.cost).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(product.id, product.stock_quantity - 1)}
                        disabled={product.stock_quantity === 0}
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                      >
                        ➖
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStock(product.id, product.stock_quantity + 1)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200"
                      >
                        ➕
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <CardContent className="text-center py-16">
              <div className="space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Archive className="h-12 w-12 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    📦 Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {searchTerm 
                      ? 'Nenhum produto corresponde aos filtros aplicados' 
                      : 'Adicione produtos para controlar seu estoque'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ModernDashboardLayout>
  );
}
