
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  sellPrice: number;
  costPrice: number;
  currentStock: number;
  minStock: number;
  isVisible: boolean;
  image?: string;
}

const Products = () => {
  // Estado vazio - sistema limpo
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    sellPrice: 0,
    costPrice: 0,
    currentStock: 0,
    minStock: 0,
    isVisible: true,
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(product => product.currentStock <= product.minStock);

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } as Product : p));
    } else {
      const product: Product = {
        ...newProduct,
        id: Date.now().toString(),
      };
      setProducts([...products, product]);
    }
    
    setNewProduct({
      name: '',
      description: '',
      category: '',
      sellPrice: 0,
      costPrice: 0,
      currentStock: 0,
      minStock: 0,
      isVisible: true,
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      category: product.category,
      sellPrice: product.sellPrice,
      costPrice: product.costPrice,
      currentStock: product.currentStock,
      minStock: product.minStock,
      isVisible: product.isVisible,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Produtos</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingProduct(null);
                setNewProduct({
                  name: '',
                  description: '',
                  category: '',
                  sellPrice: 0,
                  costPrice: 0,
                  currentStock: 0,
                  minStock: 0,
                  isVisible: true,
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sellPrice">Preço de Venda</Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      step="0.01"
                      value={newProduct.sellPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, sellPrice: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="costPrice">Preço de Custo</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      value={newProduct.costPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentStock">Estoque Atual</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={newProduct.currentStock}
                      onChange={(e) => setNewProduct({ ...newProduct, currentStock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minStock">Estoque Mínimo</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={newProduct.minStock}
                      onChange={(e) => setNewProduct({ ...newProduct, minStock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVisible"
                    checked={newProduct.isVisible}
                    onCheckedChange={(checked) => setNewProduct({ ...newProduct, isVisible: checked })}
                  />
                  <Label htmlFor="isVisible">Visível no catálogo</Label>
                </div>
                <Button onClick={handleSaveProduct} className="w-full">
                  {editingProduct ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Empty State quando não há produtos */}
        {products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum produto cadastrado
              </h3>
              <p className="text-gray-500 mb-6">
                Comece cadastrando seu primeiro produto para gerenciar seu estoque
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {lowStockProducts.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Produtos com Estoque Baixo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lowStockProducts.map(product => (
                      <div key={product.id} className="text-sm text-orange-700">
                        <strong>{product.name}</strong> - Estoque: {product.currentStock} (mínimo: {product.minStock})
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Lista de Produtos ({filteredProducts.length})
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            {!product.isVisible && (
                              <Badge variant="secondary">Oculto</Badge>
                            )}
                            {product.currentStock <= product.minStock && (
                              <Badge variant="destructive">Estoque Baixo</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Categoria:</span>
                              <p className="font-medium">{product.category}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Preço:</span>
                              <p className="font-medium text-blue-600">R$ {product.sellPrice.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Custo:</span>
                              <p className="font-medium">R$ {product.costPrice.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Estoque:</span>
                              <p className="font-medium">{product.currentStock} unidades</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && searchTerm && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum produto encontrado para "{searchTerm}"
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
