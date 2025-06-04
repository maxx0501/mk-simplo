
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';

export default function Sales() {
  const [user, setUser] = useState<any>(null);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
            <p className="text-gray-500">Registre e acompanhe suas vendas</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Venda
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma venda registrada
            </h3>
            <p className="text-gray-500 mb-6">
              Comece registrando sua primeira venda
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Registrar Primeira Venda
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
