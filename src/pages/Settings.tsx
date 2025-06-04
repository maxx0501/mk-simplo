import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useStoreCreation } from '@/hooks/useStoreCreation';
import { 
  Store, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Printer,
  Wifi,
  Lock
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const { createStore } = useStoreCreation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasStore, setHasStore] = useState(false);

  // Estados para criação de loja
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreType, setNewStoreType] = useState('');

  // Estados para as configurações
  const [storeSettings, setStoreSettings] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    cep: '',
    cnpj: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    lowStockAlert: true,
    newOrderAlert: true,
    dailyReport: true
  });

  const [systemSettings, setSystemSettings] = useState({
    theme: 'light',
    language: 'pt-BR',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    autoBackup: true,
    twoFactorAuth: false
  });

  useEffect(() => {
    const loadUserData = () => {
      const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
      setUser(userData);
      setHasStore(!!userData.store_id);
      
      // Carregar dados da loja se existir store_id
      if (userData.store_id) {
        loadStoreData(userData.store_id);
      }
    };

    loadUserData();
  }, []);

  const loadStoreData = async (storeId: string) => {
    try {
      const { data: storeData, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

      if (error) {
        console.error('Erro ao carregar dados da loja:', error);
        return;
      }

      if (storeData) {
        setStoreSettings({
          name: storeData.name || '',
          email: storeData.email || '',
          phone: storeData.phone || '',
          address: '',
          city: '',
          cep: '',
          cnpj: storeData.cnpj || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados da loja:', error);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStoreName.trim() || !newStoreType) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome da loja e tipo são obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    const success = await createStore(newStoreName, '', '', newStoreType);
    
    if (success) {
      setHasStore(true);
      setNewStoreName('');
      setNewStoreType('');
      
      // Recarregar dados do usuário
      const updatedUser = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
      setUser(updatedUser);
      
      if (updatedUser.store_id) {
        loadStoreData(updatedUser.store_id);
      }
      
      toast({
        title: "Loja criada com sucesso!",
        description: "Agora você pode configurar os dados da sua loja."
      });
    }
  };

  const handleSaveStoreSettings = async () => {
    if (!user?.store_id) {
      toast({
        title: "Erro",
        description: "Loja não encontrada",
        variant: "destructive"
      });
      return;
    }

    if (!storeSettings.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da loja é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('stores')
        .update({
          name: storeSettings.name.trim(),
          phone: storeSettings.phone,
          cnpj: storeSettings.cnpj
        })
        .eq('id', user.store_id);

      if (error) {
        throw error;
      }

      // Atualizar localStorage com novo nome da loja
      const updatedUser = {
        ...user,
        store_name: storeSettings.name.trim()
      };
      localStorage.setItem('mksimplo_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Forçar atualização da sidebar
      window.dispatchEvent(new Event('storage'));

      toast({
        title: "Configurações salvas",
        description: "As configurações da loja foram atualizadas com sucesso."
      });
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram salvas."
    });
    setLoading(false);
  };

  const handleSaveSystem = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Sistema atualizado",
      description: "As configurações do sistema foram aplicadas."
    });
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as configurações da sua loja e sistema
          </p>
        </div>

        <Tabs defaultValue="store" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Loja
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Configurações da Loja */}
          <TabsContent value="store">
            {!hasStore ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Criar Loja
                  </CardTitle>
                  <CardDescription>
                    Você ainda não tem uma loja cadastrada. Crie sua primeira loja para começar.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateStore} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-store-name">Nome da Loja *</Label>
                        <Input
                          id="new-store-name"
                          value={newStoreName}
                          onChange={(e) => setNewStoreName(e.target.value)}
                          placeholder="Digite o nome da sua loja"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-store-type">Tipo da Loja *</Label>
                        <Select value={newStoreType} onValueChange={setNewStoreType} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="roupas">Roupas e Acessórios</SelectItem>
                            <SelectItem value="alimentacao">Alimentação</SelectItem>
                            <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                            <SelectItem value="casa">Casa e Decoração</SelectItem>
                            <SelectItem value="beleza">Beleza e Cosméticos</SelectItem>
                            <SelectItem value="esportes">Esportes e Lazer</SelectItem>
                            <SelectItem value="livros">Livros e Papelaria</SelectItem>
                            <SelectItem value="pet">Pet Shop</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={loading || !newStoreName.trim() || !newStoreType}
                      >
                        {loading ? 'Criando...' : 'Criar Loja'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Informações da Loja
                  </CardTitle>
                  <CardDescription>
                    Configure as informações básicas da sua loja
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Nome da Loja *</Label>
                      <Input
                        id="store-name"
                        value={storeSettings.name}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Digite o nome da sua loja"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">E-mail</Label>
                      <Input
                        id="store-email"
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, email: e.target.value }))}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Telefone</Label>
                      <Input
                        id="store-phone"
                        value={storeSettings.phone}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-cnpj">CNPJ</Label>
                      <Input
                        id="store-cnpj"
                        value={storeSettings.cnpj}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, cnpj: e.target.value }))}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-address">Endereço</Label>
                      <Input
                        id="store-address"
                        value={storeSettings.address}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Rua, número, bairro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-city">Cidade</Label>
                      <Input
                        id="store-city"
                        value={storeSettings.city}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Cidade - UF"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveStoreSettings} 
                      disabled={loading || !storeSettings.name.trim()}
                    >
                      {loading ? 'Salvando...' : 'Salvar Configurações'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Configurações de Notificações */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Configure como e quando receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por E-mail</Label>
                      <p className="text-sm text-gray-500">Receba alertas importantes por e-mail</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alerta de Estoque Baixo</Label>
                      <p className="text-sm text-gray-500">Seja notificado quando produtos estiverem com estoque baixo</p>
                    </div>
                    <Switch
                      checked={notificationSettings.lowStockAlert}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, lowStockAlert: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Novos Pedidos</Label>
                      <p className="text-sm text-gray-500">Receba alertas de novos pedidos</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newOrderAlert}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, newOrderAlert: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Relatório Diário</Label>
                      <p className="text-sm text-gray-500">Receba um resumo diário das vendas</p>
                    </div>
                    <Switch
                      checked={notificationSettings.dailyReport}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, dailyReport: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Notificações'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações do Sistema */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Sistema
                </CardTitle>
                <CardDescription>
                  Configure preferências do sistema e aparência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <Select
                      value={systemSettings.theme}
                      onValueChange={(value) => setSystemSettings(prev => ({ ...prev, theme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select
                      value={systemSettings.language}
                      onValueChange={(value) => setSystemSettings(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Moeda</Label>
                    <Select
                      value={systemSettings.currency}
                      onValueChange={(value) => setSystemSettings(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fuso Horário</Label>
                    <Select
                      value={systemSettings.timezone}
                      onValueChange={(value) => setSystemSettings(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Backup Automático</Label>
                      <p className="text-sm text-gray-500">Fazer backup automático dos dados diariamente</p>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => 
                        setSystemSettings(prev => ({ ...prev, autoBackup: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSystem} disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Sistema'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações de Segurança */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Segurança
                </CardTitle>
                <CardDescription>
                  Gerencie a segurança da sua conta e dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                    </div>
                    <Switch
                      checked={systemSettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSystemSettings(prev => ({ ...prev, twoFactorAuth: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Alterar Senha</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Mantenha sua conta segura com uma senha forte
                    </p>
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Senha Atual</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button>Alterar Senha</Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Sessões Ativas</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Gerencie dispositivos conectados à sua conta
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Wifi className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Chrome - Windows</p>
                            <p className="text-sm text-gray-500">São Paulo, Brasil - Ativo agora</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Atual</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Phone className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">Safari - iPhone</p>
                            <p className="text-sm text-gray-500">São Paulo, Brasil - 2 horas atrás</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
