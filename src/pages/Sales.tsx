import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Trash2, DollarSign, Package, Calculator, Search } from 'lucide-react';
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
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  created_at: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Sales() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

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
        .gt('stock_quantity', 0)
        .order('name');

      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive"
      });
    }
  };

  const fetchSales = async (storeId: string) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('id, product_id, quantity, unit_price, total_amount, created_at')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSales((data as Sale[]) || []);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
    }
  };

  const addToCart = () => {
    if (!selectedProduct) {
      toast({
        title: "❌ Erro",
        description: "Selecione um produto",
        variant: "destructive"
      });
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    if (quantity > product.stock_quantity) {
      toast({
        title: "❌ Erro",
        description: "Quantidade maior que o estoque disponível",
        variant: "destructive"
      });
      return;
    }

    const existingItem = cart.find(item => item.product.id === selectedProduct);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        toast({
          title: "❌ Erro",
          description: "Quantidade total maior que o estoque disponível",
          variant: "destructive"
        });
        return;
      }
      setCart(cart.map(item => 
        item.product.id === selectedProduct 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity }]);
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const processSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "❌ Erro",
        description: "Carrinho vazio",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      for (const item of cart) {
        // Registrar venda
        const { error: saleError } = await supabase
          .from('sales')
          .insert({
            store_id: user.store_id,
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: item.product.price,
            total_amount: item.product.price * item.quantity,
            product_name: item.product.name,
            seller_name: user.name || 'Sistema'
          });

        if (saleError) throw saleError;

        // Atualizar estoque
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: item.product.stock_quantity - item.quantity 
          })
          .eq('id', item.product.id);

        if (stockError) throw stockError;
      }

      toast({
        title: "✅ Sucesso",
        description: "Venda realizada com sucesso!"
      });

      setCart([]);
      fetchProducts(user.store_id);
      fetchSales(user.store_id);
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível processar a venda",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                🛒 Ponto de Venda
              </h1>
              <p className="text-gray-600 text-lg">Registre suas vendas rapidamente</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Adicionar ao Carrinho */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 animate-in slide-in-from-left duration-700">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <CardTitle className="text-2xl font-bold">🛍️ Adicionar Produto</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">🔍 Buscar Produto</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Digite para buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">📦 Selecionar Produto</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="h-12 border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                    <SelectValue placeholder="Escolha um produto..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-gray-200/50 bg-white/95 backdrop-blur-sm">
                    {filteredProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        📦 {product.name} - R$ {product.price.toFixed(2)} (Estoque: {product.stock_quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">🔢 Quantidade</Label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="h-12 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                />
              </div>

              <Button 
                onClick={addToCart}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                <Plus className="mr-2 h-5 w-5" />
                ➕ Adicionar ao Carrinho
              </Button>
            </CardContent>
          </Card>

          {/* Carrinho */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 animate-in slide-in-from-right duration-700">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                🛒 Carrinho
                <span className="text-lg font-normal">({cart.length} itens)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div 
                      key={item.product.id} 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-white rounded-xl border border-gray-100/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">📦 {item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          💰 R$ {item.product.price.toFixed(2)} x {item.quantity} = R$ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.product.id)}
                        className="border-red-200/50 text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">🛒 Carrinho vazio</p>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <div className="bg-gradient-to-r from-green-50/80 to-green-100/80 p-4 rounded-xl border border-green-200/50 backdrop-blur-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-green-700">💰 Total:</span>
                      <span className="text-2xl font-bold text-green-700">R$ {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={processSale}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                  >
                    <Calculator className="mr-2 h-5 w-5" />
                    {loading ? '⏳ Processando...' : '💳 Finalizar Venda'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vendas Recentes */}
        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 animate-in slide-in-from-bottom duration-700">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold">📊 Vendas Recentes</CardTitle>
            <CardDescription className="text-purple-100">
              Últimas 10 vendas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {sales.length > 0 ? (
              <div className="space-y-4">
                {sales.map((sale, index) => (
                  <div 
                    key={sale.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-white rounded-xl border border-gray-100/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">🛍️ Venda #{sale.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        📦 Qtd: {sale.quantity} | 💰 R$ {sale.total_amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        📅 {new Date(sale.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-green-100/80 text-green-700 rounded-full text-sm font-medium backdrop-blur-sm">
                        ✅ Concluída
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">📊 Nenhuma venda registrada ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ModernDashboardLayout>
  );
}
