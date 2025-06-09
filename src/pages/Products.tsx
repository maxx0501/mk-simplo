
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { CreateStoreForm } from '@/components/store/CreateStoreForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  nome: string;
  estoque: number;
  preco: number;
  created_at: string;
}

export default function Products() {
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    nome: '',
    estoque: '',
    preco: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkUserStore();
  }, []);

  const checkUserStore = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (userData?.empresa_id) {
        setHasStore(true);
        loadProducts(userData.empresa_id);
      } else {
        setHasStore(false);
      }
    } catch (error) {
      console.error('Erro ao verificar loja:', error);
      setHasStore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (empresaId: string) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSubmitProduct = async () => {
    if (!newProduct.nome || !newProduct.estoque || !newProduct.preco) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: userData } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (!userData?.empresa_id) throw new Error('Empresa não encontrada');

      const productData = {
        empresa_id: userData.empresa_id,
        nome: newProduct.nome,
        estoque: parseInt(newProduct.estoque),
        preco: parseFloat(newProduct.preco)
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('produtos')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Produto atualizado",
          description: `${newProduct.nome} foi atualizado com sucesso`
        });
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert(productData);

        if (error) throw error;

        toast({
          title: "Produto criado",
          description: `${newProduct.nome} foi adicionado ao catálogo`
        });
      }

      setNewProduct({ nome: '', estoque: '', preco: '' });
      setEditingProduct(null);
      setIsDialogOpen(false);
      loadProducts(userData.empresa_id);
    } catch (error: any) {
      console.error('Erro:', error);
      toast({
        title: "Erro ao salvar produto",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      nome: product.nome,
      estoque: product.estoque.toString(),
      preco: product.preco.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${nome}?`)) return;

    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Produto excluído",
        description: `${nome} foi removido do catálogo`
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('id', user.id)
          .single();

        if (userData?.empresa_id) {
          loadProducts(userData.empresa_id);
        }
      }
    } catch (error: any) {
      console.error('Erro:', error);
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasStore) {
    return (
      <DashboardLayout>
        <CreateStoreForm />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-600 mt-1">Gerencie o catálogo da sua loja</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg"
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({ nome: '', estoque: '', preco: '' });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Produto</Label>
                  <Input
                    id="nome"
                    value={newProduct.nome}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome do produto"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="estoque">Quantidade em Estoque</Label>
                  <Input
                    id="estoque"
                    type="number"
                    min="0"
                    value={newProduct.estoque}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, estoque: e.target.value }))}
                    placeholder="Ex: 100"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.preco}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, preco: e.target.value }))}
                    placeholder="Ex: 29.99"
                    className="rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-lg">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmitProduct}
                    disabled={submitting}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg"
                  >
                    {submitting ? 'Salvando...' : (editingProduct ? 'Atualizar' : 'Criar Produto')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-white shadow-sm rounded-xl border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Catálogo de Produtos ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto cadastrado</h3>
                <p className="text-gray-600 mb-4">Comece adicionando seu primeiro produto ao catálogo</p>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Produto
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.nome}</TableCell>
                      <TableCell className="text-gray-600">{product.estoque} unidades</TableCell>
                      <TableCell className="text-gray-600">R$ {product.preco.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(product.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id, product.nome)}
                            className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
