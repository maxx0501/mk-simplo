
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Users, Key } from 'lucide-react';
import { useStoreCreation } from '@/hooks/useStoreCreation';
import { useStoreAccess } from '@/hooks/useStoreAccess';

export const StoreAccessOptions = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [storeName, setStoreName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const { createStore, loading: createLoading } = useStoreCreation();
  const { joinStoreById, loading: joinLoading } = useStoreAccess();

  const loading = createLoading || joinLoading;

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;
    
    const success = await createStore(storeName.trim());
    if (success) {
      setStoreName('');
    }
  };

  const handleJoinStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;
    
    await joinStoreById(accessCode.trim());
    setAccessCode('');
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Store className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao MKsimplo!</h1>
          <p className="text-gray-500 mt-2">
            Escolha uma opção para começar a usar o sistema
          </p>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-yellow-600 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Store className="h-4 w-4 inline mr-2" />
            Registrar Loja
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'join'
                ? 'border-yellow-600 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Acessar Loja
          </button>
        </div>

        {activeTab === 'create' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2" />
                Registrar Nova Loja
              </CardTitle>
              <CardDescription>
                Crie sua loja e convide outros usuários para colaborar
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
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                  disabled={loading || !storeName.trim()}
                >
                  {loading ? 'Criando...' : 'Criar Loja'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Acessar Loja Existente
              </CardTitle>
              <CardDescription>
                Use o ID da loja fornecido pelo proprietário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinStore} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessCode">ID da Loja *</Label>
                  <Input
                    id="accessCode"
                    placeholder="ID da loja"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading || !accessCode.trim()}
                >
                  {loading ? 'Acessando...' : 'Acessar Loja'}
                </Button>
              </form>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Precisa do ID da loja?</strong><br />
                  Peça para o proprietário da loja compartilhar o ID com você.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
