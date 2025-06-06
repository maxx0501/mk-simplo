
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Package, DollarSign, LogOut, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
}

const EmployeeSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSale, setNewSale] = useState({
    product_name: '',
    product_value: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const employeeData = JSON.parse(localStorage.getItem('mksimplo_employee') || '{}');

  useEffect(() => {
    if (!employeeData.id) {
      navigate('/employee-login');
      return;
    }
    loadSales();
  }, []);

  const loadSales = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('employee_id', employeeData.id)
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
    
    if (!newSale.product_name || !newSale.product_value) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome do produto e o valor",
        variant: "destructive"
      });
      return;
    }

    const value = parseFloat(newSale.product_value);
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
      const saleData = {
        store_id: employeeData.store_id,
        employee_id: employeeData.id,
        employee_name: employeeData.name,
        product_name: newSale.product_name,
        product_value: value,
        notes: newSale.notes || null,
        sale_date: new Date().toISOString()
      };

      const { error } = await supabase
        .from('sales')
        .insert([saleData]);

      if (error) throw error;
      
      toast({
        title: "Venda registrada com sucesso",
        description: `${newSale.product_name} - R$ ${value.toFixed(2)}`
      });

      setNewSale({ product_name: '', product_value: '', notes: '' });
      loadSales();
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

  const handleLogout = () => {
    localStorage.removeItem('mksimplo_employee');
    toast({
      title: "Logout realizado",
      description: "Até logo!"
    });
    navigate('/employee-login');
  };

  const copyStoreId = () => {
    navigator.clipboard.writeText(employeeData.store_id);
    toast({
      title: "ID copiado!",
      description: "ID da loja copiado para a área de transferência"
    });
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.product_value, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Vendas</h1>
                <p className="text-sm text-gray-600">
                  {employeeData.name} - {employeeData.store_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">ID da Loja:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{employeeData.store_id?.slice(0, 8)}...</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyStoreId}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Nova Venda */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Registrar Nova Venda</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="product_name">Nome do Produto *</Label>
                    <Input
                      id="product_name"
                      value={newSale.product_name}
                      onChange={(e) => setNewSale(prev => ({ ...prev, product_name: e.target.value }))}
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
                      value={newSale.product_value}
                      onChange={(e) => setNewSale(prev => ({ ...prev, product_value: e.target.value }))}
                      placeholder="0,00"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={newSale.notes}
                      onChange={(e) => setNewSale(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Informações adicionais da venda..."
                      rows={3}
                      disabled={submitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    disabled={submitting}
                  >
                    {submitting ? 'Registrando...' : 'Registrar Venda'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Resumo */}
            <Card className="bg-white shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Resumo do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">Total de Vendas</span>
                    </div>
                    <span className="font-semibold">{sales.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">Valor Total</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      R$ {totalSales.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Vendas */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Minhas Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Carregando vendas...</p>
                  </div>
                ) : sales.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma venda registrada</h3>
                    <p className="text-gray-600">Registre sua primeira venda no formulário ao lado</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Valor</TableHead>
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
                            {new Date(sale.sale_date).toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {sale.notes || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSales;
