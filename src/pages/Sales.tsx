
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Plus, DollarSign, Calendar, Search } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { useToast } from '@/hooks/use-toast';
import { useProductStorage } from '@/hooks/useProductStorage';
import { useSalesStorage } from '@/hooks/useSalesStorage';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Sales() {
  const [user, setUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [formData, setFormData] = useState({
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { products } = useProductStorage();
  const { sales, addSale } = useSalesStorage();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
  }, []);

  // Se o usuário não tem loja, mostrar opções de acesso
  if (!user?.store_id) {
    return (
      <DashboardLayout>
        <StoreAccessOptions />
      </DashboardLayout>
    );
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast({
        title: "Produto obrigatório",
        description: "Selecione um produto para registrar a venda",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const product = products.find(p => p.id === selectedProduct);
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      const saleData = {
        product_name: product.name,
        product_value: product.price,
        notes: formData.notes,
        employee_name: user.full_name || user.email?.split('@')[0] || 'Usuário'
      };

      addSale(saleData);
      
      toast({
        title: "Venda registrada com sucesso",
        description: `${product.name} - R$ ${product.price.toFixed(2)}`
      });

      // Resetar formulário
      setFormData({ notes: '' });
      setSelectedProduct('');
      setProductSearch('');
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Erro:', error);
      toast({
        title: "Erro ao registrar venda",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ notes: '' });
    setSelectedProduct('');
    setProductSearch('');
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.product_value, 0);
  const todaySales = sales.filter(sale => {
    const today = new Date().toDateString();
    const saleDate = new Date(sale.sale_date).toDateString();
    return today === saleDate;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
            <p className="text-gray-500">Registre e acompanhe suas vendas</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nova Venda</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="product">Produto *</Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Pesquisar produto..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="pl-10"
                        disabled={submitting}
                      />
                    </div>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct} disabled={submitting}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredProducts.length === 0 ? (
                          <div className="p-2 text-center text-gray-500">
                            {productSearch ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                          </div>
                        ) : (
                          filteredProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              <div className="flex justify-between items-center w-full">
                                <span>{product.name}</span>
                                <span className="text-green-600 font-medium ml-2">
                                  R$ {product.price.toFixed(2)}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Informações adicionais da venda..."
                    rows={3}
                    disabled={submitting}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={submitting}
                  >
                    {submitting ? 'Registrando...' : 'Registrar Venda'}
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySales.length}</div>
              <p className="text-xs text-muted-foreground">vendas registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sales.length}</div>
              <p className="text-xs text-muted-foreground">vendas registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">em vendas</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales List */}
        {sales.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma venda registrada
              </h3>
              <p className="text-gray-500 mb-6">
                {products.length === 0 
                  ? 'Cadastre produtos primeiro para registrar vendas'
                  : 'Comece registrando sua primeira venda'
                }
              </p>
              {products.length > 0 ? (
                <Button onClick={() => setIsDialogOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Primeira Venda
                </Button>
              ) : (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href="/products">
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Produtos
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Vendas Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.product_name}</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        R$ {sale.product_value.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {sale.employee_name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(sale.sale_date).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {sale.notes || '-'}
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
