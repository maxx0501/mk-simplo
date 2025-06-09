
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store } from 'lucide-react';
import { useStoreCreation } from '@/hooks/useStoreCreation';

export const StoreAccessOptions = () => {
  const [storeName, setStoreName] = useState('');
  const { createStore, loading } = useStoreCreation();

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;
    
    const success = await createStore(storeName.trim());
    if (success) {
      setStoreName('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Store className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao MKsimplo!</h1>
          <p className="text-gray-500 mt-2">
            Registre sua loja para começar a usar o sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Registrar Nova Loja
            </CardTitle>
            <CardDescription>
              Crie sua loja e gerencie vendedores e produtos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateStore} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja *</Label>
                <Input
                  id="storeName"
                  placeholder="Ex: Minha Loja de Roupas"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading || !storeName.trim()}
              >
                {loading ? 'Criando...' : 'Criar Loja'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
