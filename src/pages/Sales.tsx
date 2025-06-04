import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, ShoppingCart, Calendar, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Sale {
  id: string;
  date: string;
  customerName: string;
  customerEmail?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
}

const mockProducts = [
  { id: '1', name: 'Produto Exemplo', price: 29.90, stock: 0 },
];

const Sales = () => {
  const { toast } = useToast();
  // Estado vazio - sistema limpo
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const [newSale, setNewSale] = useState({
    customerName: '',
    customerEmail: '',
    items: [] as SaleItem[],
    discount: 0,
    paymentMethod: '',
  });

  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1,
  });

  const filteredSales = sales.filter(sale =>
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.includes(searchTerm)
  );

  const todaySales = sales.filter(sale => {
    const today = new Date().toDateString();
    const saleDate = new Date(sale.date).toDateString();
    return today === saleDate && sale.status === 'completed';
  });

  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);

  const addItemToSale = () => {
    const product = mockProducts.find(p => p.id === currentItem.productId);
    if (!product) {
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive",
      });
      return;
    }

    if (currentItem.quantity > product.stock) {
      toast({
        title: "Erro",
        description: "Quantidade maior que o estoque disponível",
        variant: "destructive",
      });
      return;
    }

    const item: SaleItem = {
      productId: product.id,
      productName: product.name,
      quantity: currentItem.quantity,
      unitPrice: product.price,
      total: product.price * currentItem.quantity,
    };

    setNewSale({
      ...newSale,
      items: [...newSale.items, item],
    });

    setCurrentItem({ productId: '', quantity: 1 });
  };

  const removeItemFromSale = (index: number) => {
    const updatedItems = newSale.items.filter((_, i) => i !== index);
    setNewSale({ ...newSale, items: updatedItems });
  };

  const calculateSaleTotal = () => {
    const subtotal = newSale.items.reduce((sum, item) => sum + item.total, 0);
    return subtotal - newSale.discount;
  };

  const completeSale = () => {
    if (newSale.items.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item à venda",
        variant: "destructive",
      });
      return;
    }

    if (!newSale.customerName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do cliente é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!newSale.paymentMethod) {
      toast({
        title: "Erro",
        description: "Método de pagamento é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const subtotal = newSale.items.reduce((sum, item) => sum + item.total, 0);
    
    const sale: Sale = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      customerName: newSale.customerName,
      customerEmail: newSale.customerEmail || undefined,
      items: newSale.items,
      subtotal,
      discount: newSale.discount,
      total: calculateSaleTotal(),
      paymentMethod: newSale.paymentMethod,
      status: 'completed',
    };

    setSales([sale, ...sales]);
    
    setNewSale({
      customerName: '',
      customerEmail: '',
      items: [],
      discount: 0,
      paymentMethod: '',
    });
    
    setIsNewSaleOpen(false);
    
    toast({
      title: "Venda concluída",
      description: `Venda #${sale.id} registrada com sucesso`,
    });
  };

  const getStatusBadge = (status: Sale['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluída</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      'credit_card': 'Cartão de Crédito',
      'debit_card': 'Cartão de Débito',
      'pix': 'PIX',
      'cash': 'Dinheiro',
      'bank_transfer': 'Transferência',
    };
    return methods[method] || method;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Vendas</h1>
          <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Venda</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Cadastre produtos primeiro
                  </h3>
                  <p className="text-gray-500">
                    Você precisa ter produtos cadastrados para realizar vendas
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySales.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {todayRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sales.filter(s => s.status === 'completed').length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Histórico de Vendas ({filteredSales.length})
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma venda registrada
                </h3>
                <p className="text-gray-500 mb-6">
                  Suas vendas aparecerão aqui quando você começar a vender
                </p>
                <Button onClick={() => setIsNewSaleOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Primeira Venda
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSales.map(sale => (
                  <div key={sale.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">Venda #{sale.id}</h3>
                          {getStatusBadge(sale.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Cliente:</span>
                            <p className="font-medium">{sale.customerName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Data:</span>
                            <p className="font-medium">
                              {new Date(sale.date).toLocaleDateString('pt-BR')} às{' '}
                              {new Date(sale.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Pagamento:</span>
                            <p className="font-medium">{getPaymentMethodLabel(sale.paymentMethod)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <p className="font-medium text-blue-600">R$ {sale.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSale(sale)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredSales.length === 0 && searchTerm && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma venda encontrada para "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedSale && (
          <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Detalhes da Venda #{selectedSale.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Informações do Cliente</h4>
                  <p><strong>Nome:</strong> {selectedSale.customerName}</p>
                  {selectedSale.customerEmail && (
                    <p><strong>Email:</strong> {selectedSale.customerEmail}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Itens</h4>
                  <div className="space-y-2">
                    {selectedSale.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.productName} x{item.quantity}</span>
                        <span>R$ {item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal:</span>
                    <span>R$ {selectedSale.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedSale.discount > 0 && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Desconto:</span>
                      <span>- R$ {selectedSale.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>R$ {selectedSale.total.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <p><strong>Pagamento:</strong> {getPaymentMethodLabel(selectedSale.paymentMethod)}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedSale.status)}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Sales;
