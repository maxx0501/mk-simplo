
import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Store, User, Save, Copy, Shield } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StoreData {
  id: string;
  name: string;
  owner_name: string;
  email: string;
  access_code: string;
  plan_type: string;
  status: string;
}

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    email: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.store_id) {
      fetchStoreData(userData.store_id);
    }
  }, []);

  const fetchStoreData = async (storeId: string) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

      if (error) throw error;
      
      if (data) {
        setStoreData(data);
        setFormData({
          name: data.name || '',
          owner_name: data.owner_name || '',
          email: data.email || ''
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados da loja:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os dados da loja",
        variant: "destructive"
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeData) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('stores')
        .update({
          name: formData.name,
          owner_name: formData.owner_name,
          email: formData.email
        })
        .eq('id', storeData.id);

      if (error) throw error;

      // Atualizar localStorage
      const updatedUser = {
        ...user,
        store_name: formData.name
      };
      localStorage.setItem('mksimplo_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage'));

      toast({
        title: "✅ Sucesso",
        description: "Dados atualizados com sucesso!"
      });

      fetchStoreData(storeData.id);
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "❌ Erro",
        description: error.message || "Não foi possível salvar as alterações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyAccessCode = () => {
    if (storeData?.access_code) {
      navigator.clipboard.writeText(storeData.access_code);
      toast({
        title: "📋 Copiado!",
        description: "Código de acesso copiado para a área de transferência"
      });
    }
  };

  // Se o usuário não tem loja, mostrar opções de acesso
  if (!user?.store_id) {
    return (
      <ModernDashboardLayout>
        <StoreAccessOptions />
      </ModernDashboardLayout>
    );
  }

  if (!storeData) {
    return (
      <ModernDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header melhorado */}
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-3">
              ⚙️ Configurações
            </h1>
            <p className="text-gray-600 text-lg">Gerencie os dados da sua loja</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Dados da Loja */}
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Store className="w-6 h-6" />
                Dados da Loja
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
                    🏪 Nome da Loja
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Digite o nome da sua loja"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_name" className="text-gray-700 font-medium flex items-center gap-2">
                    👤 Nome do Proprietário
                  </Label>
                  <Input
                    id="owner_name"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({...formData, owner_name: e.target.value})}
                    className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                    📧 Email de Contato
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Digite o email da loja"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? '⏳ Salvando...' : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      💾 Salvar Alterações
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-6 rounded-t-2xl">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Shield className="w-6 h-6" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Código de Acesso */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                <Label className="text-gray-700 font-medium flex items-center gap-2 mb-3">
                  🔑 Código de Acesso da Loja
                </Label>
                <div className="flex gap-3">
                  <Input
                    value={storeData.access_code}
                    readOnly
                    className="h-12 bg-white border-gray-200 rounded-xl font-mono text-lg font-bold text-center"
                  />
                  <Button
                    type="button"
                    onClick={copyAccessCode}
                    variant="outline"
                    className="h-12 px-4 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  💡 Compartilhe este código com seus vendedores para que possam acessar o sistema
                </p>
              </div>

              {/* Status da Conta */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <span className="font-medium text-gray-700">📊 Plano Atual:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    storeData.plan_type === 'premium' 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {storeData.plan_type === 'premium' ? '👑 Premium' : '🆓 Gratuito'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <span className="font-medium text-gray-700">✅ Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    storeData.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {storeData.status === 'active' ? '🟢 Ativo' : '🔴 Inativo'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <span className="font-medium text-gray-700">🏪 ID da Loja:</span>
                  <span className="font-mono text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                    {storeData.id.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModernDashboardLayout>
  );
}
