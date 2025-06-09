
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const EmpresaAccessOptions = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empresaName, setEmpresaName] = useState('');
  const { toast } = useToast();

  const handleCreateEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresaName.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Criar empresa
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .insert({ nome: empresaName.trim() })
        .select()
        .single();

      if (empresaError) throw empresaError;

      // Criar usuário vinculado à empresa
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          id: user.id,
          empresa_id: empresaData.id,
          nome: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
          email: user.email || ''
        });

      if (usuarioError) throw usuarioError;

      // Atualizar localStorage
      const userData = {
        id: user.id,
        email: user.email,
        nome: user.user_metadata?.full_name || user.email?.split('@')[0],
        empresa_id: empresaData.id,
        empresa_nome: empresaData.nome
      };

      localStorage.setItem('mksimplo_user', JSON.stringify(userData));

      toast({
        title: "Empresa criada!",
        description: "Sua empresa foi criada com sucesso."
      });

      // Recarregar página
      window.location.reload();

    } catch (error: any) {
      console.error('Erro ao criar empresa:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a empresa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <CardTitle className="text-2xl">Configurar Empresa</CardTitle>
          <p className="text-gray-600">
            Você precisa configurar uma empresa para continuar
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showCreateForm ? (
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Nova Empresa
            </Button>
          ) : (
            <form onSubmit={handleCreateEmpresa} className="space-y-4">
              <div>
                <Label htmlFor="empresa_name">Nome da Empresa</Label>
                <Input
                  id="empresa_name"
                  value={empresaName}
                  onChange={(e) => setEmpresaName(e.target.value)}
                  placeholder="Digite o nome da sua empresa"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Criando...' : 'Criar Empresa'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
