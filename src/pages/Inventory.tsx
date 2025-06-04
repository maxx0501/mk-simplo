
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Plus, 
  Edit, 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StockItem {
  id: string;
  product_name: string;
  sku: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  location: string;
  last_updated: string;
}

export default function Inventory() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  // Mock data - em uma aplicação real, isso viria do Supabase
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: '1',
      product_name: 'Smartphone Galaxy',
      sku: 'PHONE-001',
      current_stock: 5,
      min_stock: 10,
      max_stock: 100,
      location: 'A1-001',
      last_updated: '2024-01-15'
    },
    {
      id: '2',
      product_name: 'Notebook Dell',
      sku: 'LAPTOP-002',
      current_stock: 25,
      min_stock: 5,
      max_stock: 50,
      location: 'B2-003',
      last_updated: '2024-01-14'
    },
    {
      id: '3',
      product_name: 'Mouse Wireless',
      sku: 'MOUSE-003',
      current_stock: 2,
      min_stock: 15,
      max_stock: 200,
      location: 'C1-015',
      last_updated: '2024-01-13'
    }
  ]);

  const filteredItems = stockItems.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item: StockItem) => {
    if (item.current_stock <= item.min_stock) {
      return { status: 'Estoque Baixo', variant: 'destructive' as const };
    }
    if (item.current_stock >= item.max_stock) {
      return { status: 'Estoque Alto', variant: 'secondary' as const };
    }
    return { status: 'Normal', variant: 'default' as const };
  };

  const handleStockAdjustment = (type: 'increase' | 'decrease') => {
    if (!selectedItem || !adjustmentQuantity) {
      toast({
        title: "Erro",
        description: "Selecione um produto e informe a quantidade.",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseInt(adjustmentQuantity);
    const newStock = type === 'increase' 
      ? selectedItem.current_stock + quantity
      : selectedItem.current_stock - quantity;

    if (newStock < 0) {
      toast({
        title: "Erro",
        description: "Estoque não pode ficar negativo.",
        variant: "destructive"
      });
      return;
    }

    setStockItems(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { ...item, current_stock: newStock, last_updated: new Date().toISOString().split('T')[0] }
        : item
    ));

    toast({
      title: "Estoque Atualizado",
      description: `${type === 'increase' ? 'Adicionado' : 'Removido'} ${quantity} unidades de ${selectedItem.product_name}.`
    });

    setSelectedItem(null);
    setAdjustmentQuantity('');
    setAdjustmentReason('');
    setIsEditing(false);
  };

  const lowStockItems = stockItems.filter(item => item.current_stock <= item.min_stock);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Controle de Estoque</h1>
            <p className="text-gray-500">Gerencie o inventário da sua loja</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        {/* Alertas de Estoque Baixo */}
        {lowStockItems.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Alertas de Estoque Baixo
              </CardTitle>
              <CardDescription>
                {lowStockItems.length} produto(s) com estoque abaixo do mínimo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="font-medium">{item.product_name}</span>
                    <span className="text-sm text-gray-600">
                      Estoque: {item.current_stock} (Mín: {item.min_stock})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockItems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
              <ArrowUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stockItems.reduce((total, item) => total + item.current_stock, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{lowStockItems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 125.000</div>
            </CardContent>
          </Card>
        </div>

        {/* Pesquisa e Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Inventário</CardTitle>
            <CardDescription>
              Lista de todos os produtos em estoque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por produto ou SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabela de Estoque */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Mín/Máx</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.current_stock}</TableCell>
                      <TableCell>{item.min_stock}/{item.max_stock}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.last_updated}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditing(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de Ajuste de Estoque */}
        {isEditing && selectedItem && (
          <Card className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Ajustar Estoque</h2>
              <p className="text-gray-600 mb-4">
                Produto: <strong>{selectedItem.product_name}</strong>
              </p>
              <p className="text-gray-600 mb-4">
                Estoque Atual: <strong>{selectedItem.current_stock} unidades</strong>
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={adjustmentQuantity}
                    onChange={(e) => setAdjustmentQuantity(e.target.value)}
                    placeholder="Digite a quantidade"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reason">Motivo (opcional)</Label>
                  <Input
                    id="reason"
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="Ex: Entrada de mercadoria, perda, etc."
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleStockAdjustment('increase')}
                    className="flex-1"
                  >
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                  <Button
                    onClick={() => handleStockAdjustment('decrease')}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Remover
                  </Button>
                </div>
                
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedItem(null);
                    setAdjustmentQuantity('');
                    setAdjustmentReason('');
                  }}
                  variant="ghost"
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
