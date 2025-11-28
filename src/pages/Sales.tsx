
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus } from 'lucide-react';
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
  product_value: number;
  employee_name: string;
  sale_date: string;
  notes: string;
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
    notes: ''
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
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.store_id || !formData.product_id) return;

    setLoading(true);
    try {
      // Buscar produto selecionado
      const selectedProduct = products.find(p => p.id === formData.product_id);
      if (!selectedProduct) {
        throw new Error('Produto não encontrado');
      }

      if (selectedProduct.stock_quantity <= 0) {
        throw new Error('Produto sem estoque disponível');
      }

      // Registrar venda
      const { error: saleError } = await supabase
        .from('sales')
        .insert({
          store_id: user.store_id,
          employee_id: user.id,
          employee_name: user.email?.split('@')[0] || 'Vendedor',
          product_name: selectedProduct.name,
          product_value: selectedProduct.price,
          notes: formData.notes
        });

      if (saleError) throw saleError;

      // Atualizar estoque do produto
      const { error: stockError } = await supabase
        .from('products')
        .update({ 
          stock_quantity: selectedProduct.stock_quantity - 1 
        })
        .eq('id', selectedProduct.id);

      if (stockError) throw stockError;

      toast({
        title: "Sucesso",
        description: "Venda registrada com sucesso!"
      });

      resetForm();
      fetchProducts(user.store_id);
      fetchSales(user.store_id);
    } catch (error: any) {
      console.error('Erro ao registrar venda:', error);
      toast({
        title: "Erro",
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
      notes: ''
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
      <DashboardLayout>
        <StoreAccessOptions />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
            <p className="text-gray-500">Registre e acompanhe suas vendas</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Venda
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nova Venda</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="product_search">Buscar Produto *</Label>
                  <Input
                    id="product_search"
                    placeholder="Digite o nome do produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {searchTerm && (
                  <div>
                    <Label htmlFor="product_id">Selecionar Produto *</Label>
                    <Select 
                      value={formData.product_id} 
                      onValueChange={(value) => setFormData({...formData, product_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - R$ {product.price.toFixed(2)} 
                            ({product.stock_quantity} em estoque)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Observações sobre a venda (opcional)"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading || !formData.product_id}>
                    {loading ? 'Registrando...' : 'Registrar Venda'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Sales List */}
        {sales.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{sale.product_name}</h3>
                      <p className="text-sm text-gray-600">
                        Vendedor: {sale.employee_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Data: {new Date(sale.sale_date).toLocaleDateString('pt-BR')}
                      </p>
                      {sale.notes && (
                        <p className="text-sm text-gray-600">Obs: {sale.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        R$ {Number(sale.product_value).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma venda registrada
              </h3>
              <p className="text-gray-500 mb-6">
                Comece registrando sua primeira venda
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primeira Venda
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
