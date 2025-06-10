
import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Calendar, DollarSign, Package, User, TrendingUp, Search } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
}

interface Sale {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  seller_name: string;
  created_at: string;
}

export default function Sales() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    product_id: '',
    quantity: 1,
    seller_name: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.store_id) {
      fetchProducts(userData.store_id);
      fetchSales(userData.store_id);
    }
  }, []);

  const fetchProducts = async (storeId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, stock_quantity')
        .eq('store_id', storeId)
        .gt('stock_quantity', 0);

      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const fetchSales = async (storeId: string) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSales((data as Sale[]) || []);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.store_id) return;

    const selectedProduct = products.find(p => p.id === formData.product_id);
    if (!selectedProduct) {
      toast({
        title: "❌ Erro",
        description: "Selecione um produto válido",
        variant: "destructive"
      });
      return;
    }

    if (formData.quantity > selectedProduct.stock_quantity) {
      toast({
        title: "❌ Estoque insuficiente",
        description: `Apenas ${selectedProduct.stock_quantity} unidades disponíveis`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const totalAmount = selectedProduct.price * formData.quantity;

      const { error: saleError } = await supabase
        .from('sales')
        .insert({
          store_id: user.store_id,
          product_id: formData.product_id,
          product_name: selectedProduct.name,
          quantity: formData.quantity,
          unit_price: selectedProduct.price,
          total_amount: totalAmount,
          seller_name: formData.seller_name || user.email
        });

      if (saleError) throw saleError;

      const { error: stockError } = await supabase
        .from('products')
        .update({
          stock_quantity: selectedProduct.stock_quantity - formData.quantity
        })
        .eq('id', formData.product_id);

      if (stockError) throw stockError;

      toast({
        title: "✅ Venda registrada!",
        description: `Venda de R$ ${totalAmount.toFixed(2)} realizada com sucesso`
      });

      resetForm();
      fetchProducts(user.store_id);
      fetchSales(user.store_id);
    } catch (error: any) {
      console.error('Erro ao registrar venda:', error);
      toast({
        title: "❌ Erro",
        description: error.message || "Não foi possível registrar a venda",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: '',
      quantity: 1,
      seller_name: ''
    });
    setShowForm(false);
  };

  const selectedProduct = products.find(p => p.id === formData.product_id);
  const totalAmount = selectedProduct ? selectedProduct.price * formData.quantity : 0;

  const filteredSales = sales.filter(sale =>
    sale.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.seller_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.total_amount, 0);
  const totalItemsSold = sales.reduce((acc, sale) => acc + sale.quantity, 0);

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
                🛒 Vendas
              </h1>
              <p className="text-gray-600 text-lg">Registre e acompanhe suas vendas</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              💰 Nova Venda
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium mb-1">💰 Total em Vendas</p>
                  <p className="text-3xl font-bold text-green-700">R$ {totalSalesAmount.toFixed(2)}</p>
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
                  <p className="text-3xl font-bold text-blue-700">{totalItemsSold}</p>
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
                  <p className="text-purple-600 font-medium mb-1">📊 Total de Vendas</p>
                  <p className="text-3xl font-bold text-purple-700">{sales.length}</p>
                </div>
                <div className="bg-purple-200 p-3 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de Nova Venda */}
        {showForm && (
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <CardTitle className="text-2xl font-bold">💰 Registrar Nova Venda</CardTitle>
              <CardDescription className="text-blue-100">
                Preencha os dados da venda abaixo
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="product_id" className="text-gray-700 font-medium">📦 Produto</Label>
                    <Select value={formData.product_id} onValueChange={(value) => setFormData({...formData, product_id: value})}>
                      <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - R$ {product.price.toFixed(2)} (Estoque: {product.stock_quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-gray-700 font-medium">🔢 Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedProduct?.stock_quantity || 999}
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                      className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seller_name" className="text-gray-700 font-medium">👤 Vendedor</Label>
                    <Input
                      id="seller_name"
                      value={formData.seller_name}
                      onChange={(e) => setFormData({...formData, seller_name: e.target.value})}
                      className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={user.email}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">💰 Total da Venda</Label>
                    <div className="h-12 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl flex items-center px-4">
                      <span className="text-2xl font-bold text-green-700">
                        R$ {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={loading || !formData.product_id}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? '⏳ Registrando...' : '💰 Confirmar Venda'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="px-8 py-3 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    ❌ Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Busca de Vendas */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="🔍 Buscar vendas por produto ou vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Lista de Vendas */}
        {filteredSales.length > 0 ? (
          <div className="space-y-4">
            {filteredSales.map((sale, index) => (
              <Card 
                key={sale.id} 
                className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        📦 {sale.product_name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(sale.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">👤 Vendedor</p>
                      <p className="font-medium text-gray-800">{sale.seller_name}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">🔢 Quantidade</p>
                      <p className="font-bold text-lg text-blue-600">{sale.quantity}x</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">💰 Total</p>
                      <p className="font-bold text-xl text-green-600">R$ {sale.total_amount.toFixed(2)}</p>
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
                  <ShoppingCart className="h-12 w-12 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    🛒 Nenhuma venda encontrada
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    {searchTerm ? 'Nenhuma venda corresponde à sua busca' : 'Registre sua primeira venda'}
                  </p>
                </div>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    💰 Registrar Primeira Venda
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ModernDashboardLayout>
  );
}
