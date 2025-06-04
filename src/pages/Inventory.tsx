
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, AlertTriangle, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Inventory() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
  }, []);

  // Se o usuário não tem loja, mostrar tela de criação
  if (!user?.store_id) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Store className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Bem-vindo ao MKsimplo!</CardTitle>
              <CardDescription>
                Você ainda não tem uma loja cadastrada. Crie sua primeira loja para começar a usar o sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/settings')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Criar Minha Primeira Loja
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Você pode criar sua loja nas configurações do sistema
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
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
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">no estoque</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">0</div>
              <p className="text-xs text-muted-foreground">produtos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 0,00</div>
              <p className="text-xs text-muted-foreground">em estoque</p>
            </CardContent>
          </Card>
        </div>

        {/* Estado Vazio */}
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
      </div>
    </DashboardLayout>
  );
}
