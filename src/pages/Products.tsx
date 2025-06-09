
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { EmpresaAccessOptions } from '@/components/empresa/EmpresaAccessOptions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  empresa_id: string;
}

export default function Products() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    estoque: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.empresa_id) {
      fetchProducts(userData.empresa_id);
    }
  }, []);

  const fetchProducts = async (empresaId: string) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.empresa_id) return;

    setLoading(true);
    try {
      const productData = {
        nome: formData.nome,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque),
        empresa_id: user.empresa_id
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('produtos')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!"
        });
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert(productData);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Produto adicionado com sucesso!"
        });
      }

      resetForm();
      fetchProducts(user.empresa_id);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nome: product.nome,
      preco: product.preco.toString(),
      estoque: product.estoque.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!"
      });
      
      fetchProducts(user.empresa_id);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      preco: '',
      estoque: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-500">Gerencie o catálogo da sua empresa</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="preco">Preço *</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({...formData, preco: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estoque">Estoque *</Label>
                    <Input
                      id="estoque"
                      type="number"
                      value={formData.estoque}
                      onChange={(e) => setFormData({...formData, estoque: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{product.nome}</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-green-600">
                      R$ {product.preco.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Estoque: {product.estoque} unidades
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum produto cadastrado
              </h3>
              <p className="text-gray-500 mb-6">
                Comece adicionando seu primeiro produto ao catálogo
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
