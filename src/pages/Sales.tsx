
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Plus, DollarSign, Calendar } from 'lucide-react';
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

interface Sale {
  id: string;
  product_name: string;
  product_value: number;
  sale_date: string;
  notes?: string;
  employee_name: string;
}

export default function Sales() {
  const [user, setUser] = useState<any>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    product_value: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
    if (userData?.store_id) {
      loadSales();
    }
  }, []);

  const loadSales = () => {
    // Simular carregamento de vendas - implementar com Supabase depois
    const mockSales: Sale[] = [];
    setSales(mockSales);
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
    
    if (!formData.product_name || !formData.product_value) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome do produto e o valor",
        variant: "destructive"
      });
      return;
    }

    const value = parseFloat(formData.product_value);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para o produto",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const saleData: Sale = {
        id: Date.now().toString(),
        product_name: formData.product_name,
        product_value: value,
        sale_date: new Date().toISOString(),
        notes: formData.notes,
        employee_name: user.full_name || user.email?.split('@')[0] || 'Usuário'
      };

      setSales(prev => [saleData, ...prev]);
      
      toast({
        title: "Venda registrada com sucesso",
        description: `${formData.product_name} - R$ ${value.toFixed(2)}`
      });

      // Resetar formulário
      setFormData({ product_name: '', product_value: '', notes: '' });
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
    setFormData({ product_name: '', product_value: '', notes: '' });
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
                  <Label htmlFor="product_name">Nome do Produto *</Label>
                  <Input
                    id="product_name"
                    value={formData.product_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                    placeholder="Digite o nome do produto"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label htmlFor="product_value">Valor (R$) *</Label>
                  <Input
                    id="product_value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.product_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_value: e.target.value }))}
                    placeholder="0,00"
                    disabled={submitting}
                  />
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
                Comece registrando sua primeira venda
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primeira Venda
              </Button>
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
