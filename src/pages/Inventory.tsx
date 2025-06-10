
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
        .select('id, name, stock_quantity, price')
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
  const totalStockValue = products.reduce((acc, product) => acc + (product.stock_quantity * product.price), 0);

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
      <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20">
        {/* Header melhorado */}
        <div className="bg-gradient-to-r from-white to-blue-50/50 p-8 rounded-3xl border border-blue-100/50 shadow-xl backdrop-blur-sm animate-in slide-in-from-top duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-3 animate-in fade-in duration-1000">
                📦 Controle de Estoque
              </h1>
              <p className="text-gray-600 text-lg">Monitore e gerencie seu inventário</p>
            </div>
            <Button 
              onClick={() => fetchProducts(user.store_id)}
              disabled={loading}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              🔄 Atualizar
            </Button>
          </div>
        </div>

        {/* Estatísticas do Estoque */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-white to-blue-50/50 border-blue-200/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-in slide-in-from-left duration-700 delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium mb-1">📊 Total de Produtos</p>
                  <p className="text-3xl font-bold text-blue-700">{totalProducts}</p>
                </div>
                <div className="bg-blue-200/50 p-3 rounded-xl backdrop-blur-sm">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-red-50/50 border-red-200/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-in slide-in-from-left duration-700 delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 font-medium mb-1">⚠️ Estoque Baixo</p>
                  <p className="text-3xl font-bold text-red-700">{lowStockCount}</p>
                </div>
                <div className="bg-red-200/50 p-3 rounded-xl backdrop-blur-sm">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-orange-50/50 border-orange-200/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-in slide-in-from-left duration-700 delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 font-medium mb-1">❌ Sem Estoque</p>
                  <p className="text-3xl font-bold text-orange-700">{outOfStockCount}</p>
                </div>
                <div className="bg-orange-200/50 p-3 rounded-xl backdrop-blur-sm">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50/50 border-green-200/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-in slide-in-from-left duration-700 delay-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium mb-1">💰 Valor do Estoque</p>
                  <p className="text-2xl font-bold text-green-700">R$ {totalStockValue.toFixed(2)}</p>
                </div>
                <div className="bg-green-200/50 p-3 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100/50 animate-in slide-in-from-bottom duration-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="🔍 Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-64 h-12 border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200/50 bg-white/95 backdrop-blur-sm">
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
                className={`rounded-2xl shadow-xl border transition-all duration-500 transform hover:scale-102 backdrop-blur-sm ${
                  product.stock_quantity === 0
                    ? 'bg-gradient-to-r from-red-50/80 to-red-100/80 border-red-200/50'
                    : product.stock_quantity < 10
                    ? 'bg-gradient-to-r from-orange-50/80 to-orange-100/80 border-orange-200/50'
                    : 'bg-white/80 border-gray-100/50'
                } hover:shadow-2xl animate-in slide-in-from-bottom duration-700`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center">
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-xl text-gray-800 mb-2 flex items-center gap-2">
                        📦 {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {product.stock_quantity === 0 && (
                          <span className="px-3 py-1 bg-red-100/80 text-red-700 rounded-full text-xs font-medium backdrop-blur-sm">
                            ❌ Sem Estoque
                          </span>
                        )}
                        {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                          <span className="px-3 py-1 bg-orange-100/80 text-orange-700 rounded-full text-xs font-medium backdrop-blur-sm">
                            ⚠️ Estoque Baixo
                          </span>
                        )}
                        {product.stock_quantity >= 10 && (
                          <span className="px-3 py-1 bg-green-100/80 text-green-700 rounded-full text-xs font-medium backdrop-blur-sm">
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
                        R$ {(product.stock_quantity * product.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(product.id, product.stock_quantity - 1)}
                        disabled={product.stock_quantity === 0}
                        className="flex-1 border-red-200/50 text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                      >
                        ➖
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStock(product.id, product.stock_quantity + 1)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg"
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
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 animate-in fade-in duration-1000">
            <CardContent className="text-center py-16">
              <div className="space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100/80 to-yellow-100/80 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm shadow-lg">
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
