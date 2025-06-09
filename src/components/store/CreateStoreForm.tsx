
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const CreateStoreForm = () => {
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateStoreCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateStore = async () => {
    if (!storeName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira o nome da sua loja",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Gerar código de 6 dígitos
      const storeCode = generateStoreCode();

      // Criar empresa
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .insert({ 
          nome: storeName.trim(),
          codigo_acesso: storeCode 
        })
        .select()
        .single();

      if (empresaError) throw empresaError;

      // Criar usuário proprietário
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          id: user.id,
          empresa_id: empresa.id,
          nome: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Proprietário',
          email: user.email || '',
          role: 'owner'
        });

      if (usuarioError) throw usuarioError;

      toast({
        title: "Loja criada com sucesso!",
        description: `${storeName} foi criada. Código de acesso: ${storeCode}`
      });

      // Recarregar a página para atualizar o estado
      window.location.reload();

    } catch (error: any) {
      console.error('Erro ao criar loja:', error);
      toast({
        title: "Erro ao criar loja",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg rounded-xl border-2">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Criar Sua Loja
          </CardTitle>
          <p className="text-gray-600">
            Comece configurando sua primeira loja
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeName">Nome da Loja</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ex: Minha Loja"
                className="rounded-lg"
              />
            </div>
            <Button 
              onClick={handleCreateStore}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg"
            >
              {loading ? (
                'Criando...'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Loja
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
