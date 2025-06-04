
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
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
