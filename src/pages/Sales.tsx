
import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Search, TrendingUp, Package, DollarSign } from 'lucide-react';
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
  employee_name: string;
  total_amount: number;
  sale_date: string;
  quantity: number;
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
    quantity: 1
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
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const fetchSales = async (storeId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('sales')
        .select(`
          id,
          quantity,
          total_amount,
          sale_date,
          products!inner(name),
          store_employees(name)
        `)
        .eq('store_id', storeId)
        .order('sale_date', { ascending: false });

      if (error) throw error;
      
      // Transform data to match expected interface
      const transformedSales = (data || []).map((sale: any) => ({
        id: sale.id,
        product_name: sale.products?.name || 'Produto não encontrado',
        employee_name: sale.store_employees?.name || 'Vendedor',
        total_amount: sale.total_amount,
        sale_date: sale.sale_date,
        quantity: sale.quantity
      }));
      
      setSales(transformedSales);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.store_id || !formData.product_id) return;

    setLoading(true);
    try {
      const selectedProduct = products.find(p => p.id === formData.product_id);
      if (!selectedProduct) {
        throw new Error('Produto não encontrado');
      }

      if (selectedProduct.stock_quantity < formData.quantity) {
        throw new Error('Estoque insuficiente');
      }

      const totalAmount = selectedProduct.price * formData.quantity;

      // Registrar venda
      const { error: saleError } = await (supabase as any)
        .from('sales')
        .insert({
          store_id: user.store_id,
          product_id: selectedProduct.id,
          employee_id: user.id,
          quantity: formData.quantity,
          unit_price: selectedProduct.price,
          total_amount: totalAmount
        });

      if (saleError) throw saleError;

      // Atualizar estoque
      const { error: stockError } = await supabase
        .from('products')
        .update({ 
          stock_quantity: selectedProduct.stock_quantity - formData.quantity 
        })
        .eq('id', selectedProduct.id);

      if (stockError) throw stockError;

      toast({
        title: "✅ Sucesso",
        description: "Venda registrada com sucesso!"
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
      quantity: 1
    });
    setShowForm(false);
    setSearchTerm('');
  };

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
      <div className="space-y-8 p-6">
        {/* Header melhorado */}
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-yellow-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              💰 Vendas
            </h1>
            <p className="text-gray-600 text-lg">Registre e acompanhe suas vendas diárias</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {products.length} produtos disponíveis
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {sales.length} vendas hoje
              </span>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nova Venda
          </Button>
        </div>

        {/* Formulário melhorado */}
        {showForm && (
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <ShoppingCart className="w-6 h-6" />
                Registrar Nova Venda
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="product_search" className="text-gray-700 font-medium">
                      🔍 Buscar Produto
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="product_search"
                        placeholder="Digite o nome do produto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-gray-700 font-medium">
                      📦 Quantidade
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                      className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {searchTerm && (
                  <div className="space-y-2">
                    <Label htmlFor="product_id" className="text-gray-700 font-medium">
                      ✅ Selecionar Produto
                    </Label>
                    <Select 
                      value={formData.product_id} 
                      onValueChange={(value) => setFormData({...formData, product_id: value})}
                    >
                      <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-200">
                        {filteredProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id} className="rounded-lg">
                            <div className="flex justify-between items-center w-full">
                              <span>{product.name}</span>
                              <span className="text-green-600 font-semibold ml-2">
                                R$ {product.price.toFixed(2)} ({product.stock_quantity} em estoque)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading || !formData.product_id}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? '⏳ Registrando...' : '💰 Registrar Venda'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="px-8 h-12 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    ❌ Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de vendas melhorada */}
        {sales.length > 0 ? (
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-100">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                📊 Histórico de Vendas
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {sales.length} vendas
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {sales.map((sale, index) => (
                  <div 
                    key={sale.id} 
                    className="flex items-center justify-between p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-blue-200 bg-gradient-to-r from-white to-gray-50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        📦 {sale.product_name}
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          {sale.quantity}x
                        </span>
                      </h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        👤 <strong>Vendedor:</strong> {sale.employee_name}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        📅 <strong>Data:</strong> {new Date(sale.sale_date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent flex items-center gap-1">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        R$ {Number(sale.total_amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Total da venda</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-xl border border-gray-100">
            <CardContent className="text-center py-16">
              <div className="space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-700">
                    🎯 Nenhuma venda registrada
                  </h3>
                  <p className="text-gray-500 text-lg max-w-md mx-auto">
                    Comece registrando sua primeira venda e acompanhe o crescimento do seu negócio
                  </p>
                </div>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  🚀 Registrar Primeira Venda
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ModernDashboardLayout>
  );
}
