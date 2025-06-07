
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Plus, DollarSign } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
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

interface Sale {
  id: string;
  product_name: string;
  product_value: number;
  sale_date: string;
  notes?: string;
  employee_name: string;
  created_at: string;
}

export default function Sales() {
  const [user, setUser] = useState<any>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    product_value: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
    if (userData?.store_id) {
      loadSales();
    }
  }, []);

  const loadSales = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('store_id', userData.store_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar vendas:', error);
      toast({
        title: "Erro ao carregar vendas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_name || !formData.product_value) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome do produto e valor são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const value = parseFloat(formData.product_value);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido",
        variant: "destructive"
      });
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
      
      const saleData = {
        store_id: userData.store_id,
        employee_id: userData.id, 
        employee_name: userData.full_name || userData.email?.split('@')[0] || 'Proprietário',
        product_name: formData.product_name,
        product_value: value,
        notes: formData.notes || null,
        sale_date: new Date().toISOString()
      };

      const { error } = await supabase
        .from('sales')
        .insert([saleData]);

      if (error) throw error;

      toast({
        title: "Venda registrada",
        description: `${formData.product_name} - R$ ${value.toFixed(2)}`
      });

      setFormData({ product_name: '', product_value: '', notes: '' });
      setIsDialogOpen(false);
      loadSales();
    } catch (error: any) {
      console.error('Erro ao registrar venda:', error);
      toast({
        title: "Erro ao registrar venda",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.product_value, 0);

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
            <p className="text-gray-500">Registre e acompanhe suas vendas</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-600 hover:bg-yellow-700">
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
                    placeholder="Nome do produto vendido"
                    required
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
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Informações adicionais..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                    Registrar Venda
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resumo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Resumo de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Total de Vendas</p>
                <p className="text-2xl font-bold text-green-700">{sales.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Valor Total</p>
                <p className="text-2xl font-bold text-yellow-700">R$ {totalSales.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando vendas...</p>
              </div>
            ) : sales.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma venda registrada
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece registrando sua primeira venda
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-yellow-600 hover:bg-yellow-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Primeira Venda
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.product_name}</TableCell>
                      <TableCell>{sale.employee_name}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        R$ {sale.product_value.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {new Date(sale.sale_date).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>{sale.notes || '-'}</TableCell>
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
