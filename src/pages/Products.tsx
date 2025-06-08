
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Plus, Edit2, Trash2 } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  sku?: string;
  created_at: string;
}

export default function Products() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    sku: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
    if (userData?.store_id) {
      loadProducts();
    }
  }, []);

  const loadProducts = () => {
    // Simular carregamento de produtos - implementar com Supabase depois
    const mockProducts: Product[] = [];
    setProducts(mockProducts);
  };

  // Se o usuário não tem loja, mostrar opções de acesso
  if (!user?.store_id) {
    return (
      <DashboardLayout>
        <StoreAccessOptions />
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e o preço do produto",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(formData.price);
    const stockQuantity = parseInt(formData.stock_quantity) || 0;

    if (isNaN(price) || price < 0) {
      toast({
        title: "Preço inválido",
        description: "Digite um preço válido para o produto",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const productData: Product = {
        id: editingProduct?.id || Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: price,
        stock_quantity: stockQuantity,
        sku: formData.sku,
        created_at: editingProduct?.created_at || new Date().toISOString()
      };

      if (editingProduct) {
        // Atualizar produto existente
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
        toast({
          title: "Produto atualizado",
          description: `${formData.name} foi atualizado com sucesso`
        });
      } else {
        // Adicionar novo produto
        setProducts(prev => [productData, ...prev]);
        toast({
          title: "Produto cadastrado",
          description: `${formData.name} foi adicionado ao catálogo`
        });
      }

      // Resetar formulário
      setFormData({ name: '', description: '', price: '', stock_quantity: '', sku: '' });
      setEditingProduct(null);
      setIsDialogOpen(false);
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      sku: product.sku || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Produto removido",
      description: "Produto foi removido do catálogo"
    });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock_quantity: '', sku: '' });
    setEditingProduct(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-500">Gerencie o catálogo da sua loja</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome do produto"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do produto..."
                    rows={3}
                    disabled={submitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0,00"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock_quantity">Estoque</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                      placeholder="0"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sku">SKU/Código</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Código do produto"
                    disabled={submitting}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={submitting}
                  >
                    {submitting ? 'Salvando...' : editingProduct ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products List */}
        {products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum produto cadastrado
              </h3>
              <p className="text-gray-500 mb-6">
                Comece adicionando seu primeiro produto ao catálogo
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Produtos Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-gray-600">{product.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        R$ {product.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={product.stock_quantity <= 10 ? 'text-red-600' : 'text-gray-900'}>
                          {product.stock_quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {product.sku || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
