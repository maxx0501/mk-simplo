import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStoreCreation } from '@/hooks/useStoreCreation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const StoreChoice = () => {
  const [mode, setMode] = useState<'choice' | 'create' | 'join'>('choice');
  const [storeName, setStoreName] = useState('');
  const [searchStoreName, setSearchStoreName] = useState('');
  const { createStore, loading: creating } = useStoreCreation();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createStore(storeName);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleJoinStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar loja pelo nome
      const { data: stores, error: searchError } = await supabase
        .from('stores')
        .select('*')
        .ilike('name', `%${searchStoreName}%`)
        .limit(1);

      if (searchError) throw searchError;
      if (!stores || stores.length === 0) {
        toast({
          title: "Loja não encontrada",
          description: "Nenhuma loja com esse nome foi encontrada.",
          variant: "destructive"
        });
        return;
      }

      const store = stores[0];

      // Verificar se já existe solicitação
      const { data: existingRequest } = await supabase
        .from('store_access_requests')
        .select('*')
        .eq('store_id', store.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingRequest) {
        toast({
          title: "Solicitação já enviada",
          description: "Você já solicitou acesso a esta loja. Aguarde aprovação do proprietário.",
        });
        return;
      }

      // Criar solicitação de acesso
      const { error: requestError } = await supabase
        .from('store_access_requests')
        .insert({
          store_id: store.id,
          user_id: user.id,
          status: 'pending'
        });

      if (requestError) throw requestError;

      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação foi enviada ao proprietário da loja.",
      });

      setSearchStoreName('');
      setMode('choice');
    } catch (error: any) {
      console.error('Erro ao solicitar acesso:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar a solicitação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Criar Nova Loja
            </CardTitle>
            <CardDescription>
              Você será o proprietário da loja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateStore} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja *</Label>
                <Input
                  id="storeName"
                  placeholder="Digite o nome da sua loja"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  disabled={creating}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setMode('choice')}
                  disabled={creating}
                >
                  Voltar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={creating}
                >
                  {creating ? 'Criando...' : 'Criar Loja'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Entrar em uma Loja
            </CardTitle>
            <CardDescription>
              Solicite acesso a uma loja existente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinStore} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchStore">Nome da Loja *</Label>
                <Input
                  id="searchStore"
                  placeholder="Digite o nome da loja"
                  value={searchStoreName}
                  onChange={(e) => setSearchStoreName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setMode('choice')}
                  disabled={loading}
                >
                  Voltar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Buscando...' : 'Solicitar Acesso'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Store className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo ao MKsimplo</CardTitle>
          <CardDescription>
            Escolha uma opção para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => setMode('create')}
            className="w-full bg-blue-600 hover:bg-blue-700 h-16 text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Criar Minha Loja
          </Button>
          
          <Button
            onClick={() => setMode('join')}
            variant="outline"
            className="w-full h-16 text-lg"
          >
            <Search className="mr-2 h-5 w-5" />
            Entrar em uma Loja
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreChoice;
