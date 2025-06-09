
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus } from 'lucide-react';
import { EmpresaAccessOptions } from '@/components/empresa/EmpresaAccessOptions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
}

interface Sale {
  id: string;
  produto_id: string;
  quantidade: number;
  valor_total: number;
  data: string;
  produtos?: { nome: string };
}

export default function Sales() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    produto_id: '',
    quantidade: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.empresa_id) {
      fetchProducts(userData.empresa_id);
      fetchSales(userData.empresa_id);
    }
  }, []);

  const fetchProducts = async (empresaId: string) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('empresa_id', empresaId)
        .gt('estoque', 0);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const fetchSales = async (empresaId: string) => {
    try {
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          *,
          produtos!inner(nome)
        `)
        .eq('empresa_id', empresaId)
        .order('data', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.empresa_id || !formData.produto_id || !formData.quantidade) return;

    setLoading(true);
    try {
      const selectedProduct = products.find(p => p.id === formData.produto_id);
      if (!selectedProduct) throw new Error('Produto não encontrado');

      const quantidade = parseInt(formData.quantidade);
      if (quantidade > selectedProduct.estoque) {
        throw new Error('Quantidade insuficiente em estoque');
      }

      const valorTotal = selectedProduct.preco * quantidade;

      // Registrar venda
      const { error: saleError } = await supabase
        .from('vendas')
        .insert({
          empresa_id: user.empresa_id,
          produto_id: formData.produto_id,
          quantidade: quantidade,
          valor_total: valorTotal
        });

      if (saleError) throw saleError;

      // Atualizar estoque
      const { error: stockError } = await supabase
        .from('produtos')
        .update({ 
          estoque: selectedProduct.estoque - quantidade 
        })
        .eq('id', formData.produto_id);

      if (stockError) throw stockError;

      toast({
        title: "Sucesso",
        description: "Venda registrada com sucesso!"
      });

      resetForm();
      fetchProducts(user.empresa_id);
      fetchSales(user.empresa_id);
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
      produto_id: '',
      quantidade: ''
    });
    setShowForm(false);
  };

  const selectedProduct = products.find(p => p.id === formData.produto_id);

  // Se o usuário não tem empresa, mostrar opções de acesso
  if (!user?.empresa_id) {
    return <EmpresaAccessOptions />;
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
          <Button onClick={() => setShowForm(true)} disabled={products.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Venda
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Venda</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Produto *</Label>
                    <Select value={formData.produto_id} onValueChange={(value) => setFormData({...formData, produto_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.nome} - R$ {product.preco.toFixed(2)} (Estoque: {product.estoque})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantidade">Quantidade *</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      min="1"
                      max={selectedProduct?.estoque || 1}
                      value={formData.quantidade}
                      onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                {selectedProduct && formData.quantidade && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Resumo da Venda</h3>
                    <p>Produto: {selectedProduct.nome}</p>
                    <p>Preço unitário: R$ {selectedProduct.preco.toFixed(2)}</p>
                    <p>Quantidade: {formData.quantidade}</p>
                    <p className="font-bold text-lg">
                      Total: R$ {(selectedProduct.preco * parseInt(formData.quantidade || '0')).toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
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

        {/* Sales History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            {sales.length > 0 ? (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{sale.produtos?.nome}</h4>
                      <p className="text-sm text-gray-600">
                        Quantidade: {sale.quantidade} | {new Date(sale.data).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        R$ {Number(sale.valor_total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma venda registrada
                </h3>
                <p className="text-gray-500">
                  {products.length === 0 
                    ? 'Cadastre produtos primeiro para registrar vendas'
                    : 'Registre sua primeira venda'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
