
import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Plus, Edit, Trash2, Search, Filter, Star } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock_quantity: number;
  description?: string;
  created_at: string;
}

export default function Products() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    cost: 0,
    stock_quantity: 0,
    description: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.store_id) {
      fetchProducts(userData.store_id);
    }
  }, []);

  const fetchProducts = async (storeId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.store_id) return;

    setLoading(true);
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            price: formData.price,
            cost: formData.cost,
            stock_quantity: formData.stock_quantity,
            description: formData.description
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({
          title: "✅ Sucesso",
          description: "Produto atualizado com sucesso!"
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert({
            store_id: user.store_id,
            name: formData.name,
            price: formData.price,
            cost: formData.cost,
            stock_quantity: formData.stock_quantity,
            description: formData.description
          });

        if (error) throw error;
        toast({
          title: "✅ Sucesso",
          description: "Produto adicionado com sucesso!"
        });
      }

      resetForm();
      fetchProducts(user.store_id);
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "❌ Erro",
        description: error.message || "Não foi possível salvar o produto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      cost: product.cost,
      stock_quantity: product.stock_quantity,
      description: product.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      toast({
        title: "✅ Sucesso",
        description: "Produto excluído com sucesso!"
      });
      
      fetchProducts(user.store_id);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      cost: 0,
      stock_quantity: 0,
      description: ''
    });
    setEditingProduct(null);
    setShowForm(false);
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
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 p-8 rounded-3xl border border-blue-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-3">
                📦 Produtos
              </h1>
              <p className="text-gray-600 text-lg">Gerencie o catálogo da sua loja</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              ✨ Novo Produto
            </Button>
          </div>
        </div>

        {/* Search Bar */}
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
            <Button variant="outline" className="h-12 px-6 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
              <Filter className="w-4 h-4 mr-2" />
              🎛️ Filtros
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <CardTitle className="text-2xl font-bold">
                {editingProduct ? '✏️ Editar Produto' : '➕ Novo Produto'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">🏷️ Nome do Produto</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-gray-700 font-medium">💰 Preço de Venda</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost" className="text-gray-700 font-medium">📊 Custo</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                      className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity" className="text-gray-700 font-medium">📦 Quantidade em Estoque</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
                      className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 font-medium">📝 Descrição (opcional)</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Descrição do produto..."
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? '⏳ Salvando...' : (editingProduct ? '💾 Atualizar' : '➕ Adicionar')}
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

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800 mb-2 flex items-center gap-2">
                        📦 {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-xl border border-green-200">
                      <p className="text-sm text-gray-600">💰 Preço</p>
                      <p className="font-bold text-lg text-green-700">R$ {product.price.toFixed(2)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
                      <p className="text-sm text-gray-600">📊 Custo</p>
                      <p className="font-bold text-lg text-blue-700">R$ {product.cost.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
                    <p className="text-sm text-gray-600">📦 Estoque</p>
                    <p className={`font-bold text-lg ${product.stock_quantity < 10 ? 'text-red-600' : 'text-purple-700'}`}>
                      {product.stock_quantity} unidades
                    </p>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-medium rounded-xl transition-all duration-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      ✏️ Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
                  <Package className="h-12 w-12 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    📦 Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    {searchTerm ? 'Nenhum produto corresponde à sua busca' : 'Adicione produtos ao seu catálogo'}
                  </p>
                </div>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    ✨ Adicionar Primeiro Produto
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
