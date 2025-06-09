
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmpresaAccessOptions } from '@/components/empresa/EmpresaAccessOptions';
import { supabase } from '@/integrations/supabase/client';

export default function Inventory() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalValue: 0
  });
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.empresa_id) {
      fetchInventoryData(userData.empresa_id);
    }
  }, []);

  const fetchInventoryData = async (empresaId: string) => {
    try {
      const { data: produtos } = await supabase
        .from('produtos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('estoque', { ascending: true });

      if (produtos) {
        const lowStockCount = produtos.filter(p => p.estoque < 10).length;
        const totalValue = produtos.reduce((sum, p) => sum + (p.preco * p.estoque), 0);

        setStats({
          totalProducts: produtos.length,
          lowStock: lowStockCount,
          totalValue
        });

        setProducts(produtos);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do estoque:', error);
    }
  };

  // Se o usuário não tem empresa, mostrar opções de acesso
  if (!user?.empresa_id) {
    return <EmpresaAccessOptions />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
            <p className="text-gray-500">Controle o estoque dos seus produtos</p>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">no estoque</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.lowStock}</div>
              <p className="text-xs text-muted-foreground">produtos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">em estoque</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Produtos */}
        {products.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Produtos em Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    className={`flex justify-between items-center p-4 border rounded-lg ${
                      product.estoque < 10 ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div>
                      <h4 className="font-medium">{product.nome}</h4>
                      <p className="text-sm text-gray-600">
                        R$ {Number(product.preco).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${product.estoque < 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.estoque} unidades
                      </p>
                      <p className="text-sm text-gray-600">
                        Valor: R$ {(product.preco * product.estoque).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum produto no estoque
              </h3>
              <p className="text-gray-500 mb-6">
                Cadastre produtos para começar a controlar seu estoque
              </p>
              <Button onClick={() => navigate('/products')}>
                <Package className="w-4 h-4 mr-2" />
                Ir para Produtos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
