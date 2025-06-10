
import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Save, Store, User, Lock, Bell, Palette, Globe } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [storeData, setStoreData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.store_id) {
      fetchStoreData(userData.store_id);
    }

    setProfileData({
      name: userData.name || '',
      email: userData.email || ''
    });
  }, []);

  const fetchStoreData = async (storeId: string) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('name, phone, address')
        .eq('id', storeId)
        .single();

      if (error) throw error;
      if (data) {
        setStoreData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados da loja:', error);
    }
  };

  const handleSaveStore = async () => {
    if (!user?.store_id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('stores')
        .update({
          name: storeData.name,
          phone: storeData.phone,
          address: storeData.address
        })
        .eq('id', user.store_id);

      if (error) throw error;

      toast({
        title: "✅ Sucesso",
        description: "Dados da loja atualizados com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar loja:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar os dados da loja",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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

  return (
    <ModernDashboardLayout>
      <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20">
        {/* Header melhorado */}
        <div className="bg-gradient-to-r from-white to-blue-50/50 p-8 rounded-3xl border border-blue-100/50 shadow-xl backdrop-blur-sm animate-in slide-in-from-top duration-700">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-3 animate-in fade-in duration-1000">
              ⚙️ Configurações
            </h1>
            <p className="text-gray-600 text-lg">Gerencie as configurações do seu sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configurações da Loja */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 animate-in slide-in-from-left duration-700">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Store className="h-6 w-6" />
                🏪 Dados da Loja
              </CardTitle>
              <CardDescription className="text-blue-100">
                Informações básicas da sua loja
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="store-name" className="text-gray-700 font-medium">🏷️ Nome da Loja</Label>
                <Input
                  id="store-name"
                  value={storeData.name}
                  onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                  className="h-12 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-phone" className="text-gray-700 font-medium">📞 Telefone</Label>
                <Input
                  id="store-phone"
                  value={storeData.phone}
                  onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                  placeholder="(00) 00000-0000"
                  className="h-12 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-address" className="text-gray-700 font-medium">📍 Endereço</Label>
                <Input
                  id="store-address"
                  value={storeData.address}
                  onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                  placeholder="Rua, número, bairro, cidade"
                  className="h-12 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                />
              </div>

              <Button 
                onClick={handleSaveStore}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                <Save className="mr-2 h-5 w-5" />
                {loading ? '⏳ Salvando...' : '💾 Salvar Alterações'}
              </Button>
            </CardContent>
          </Card>

          {/* Perfil do Usuário */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 animate-in slide-in-from-right duration-700">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <User className="h-6 w-6" />
                👤 Perfil do Usuário
              </CardTitle>
              <CardDescription className="text-green-100">
                Suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="text-gray-700 font-medium">👤 Nome Completo</Label>
                <Input
                  id="profile-name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="h-12 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email" className="text-gray-700 font-medium">📧 Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="h-12 border-gray-200/50 rounded-xl bg-gray-100/50 text-gray-500 cursor-not-allowed backdrop-blur-sm"
                />
                <p className="text-sm text-gray-500">📝 O email não pode ser alterado</p>
              </div>

              <Button 
                disabled
                className="w-full bg-gray-300/50 text-gray-500 h-12 rounded-xl cursor-not-allowed backdrop-blur-sm"
              >
                <Lock className="mr-2 h-5 w-5" />
                🔒 Salvar Perfil (Em breve)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Configurações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Notificações */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-in slide-in-from-bottom duration-700 delay-100">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100/80 to-yellow-200/80 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Bell className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">🔔 Notificações</h3>
              <p className="text-gray-600 text-sm mb-4">Gerencie suas preferências de notificação</p>
              <Button 
                variant="outline" 
                className="border-yellow-200/50 text-yellow-600 hover:bg-yellow-50/80 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                disabled
              >
                🔧 Em breve
              </Button>
            </CardContent>
          </Card>

          {/* Aparência */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-in slide-in-from-bottom duration-700 delay-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100/80 to-purple-200/80 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Palette className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">🎨 Aparência</h3>
              <p className="text-gray-600 text-sm mb-4">Personalize o tema e cores do sistema</p>
              <Button 
                variant="outline" 
                className="border-purple-200/50 text-purple-600 hover:bg-purple-50/80 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                disabled
              >
                🔧 Em breve
              </Button>
            </CardContent>
          </Card>

          {/* Idioma */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-in slide-in-from-bottom duration-700 delay-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100/80 to-blue-200/80 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">🌍 Idioma</h3>
              <p className="text-gray-600 text-sm mb-4">Escolha o idioma do sistema</p>
              <Button 
                variant="outline" 
                className="border-blue-200/50 text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                disabled
              >
                🇧🇷 Português
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModernDashboardLayout>
  );
}
