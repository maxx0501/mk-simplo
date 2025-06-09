
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { CreateStoreForm } from '@/components/store/CreateStoreForm';

export default function UsersPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
  }, []);

  // Se o usuário não tem loja, mostrar formulário de criação
  if (!user?.store_id) {
    return (
      <DashboardLayout>
        <CreateStoreForm />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-500">Gerencie os usuários da sua loja</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Convidar Usuário
          </Button>
        </div>

        {/* Estado Vazio */}
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum usuário adicional
            </h3>
            <p className="text-gray-500 mb-6">
              Convide outros usuários para ajudar a gerenciar sua loja
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Convidar Primeiro Usuário
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
