import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Store, 
  Users, 
  TrendingUp, 
  DollarSign,
  Search,
  Edit,
  Eye,
  Building,
  Crown,
  Clock,
  CreditCard,
  UserCheck,
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Store {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  owner_name: string;
  plan_type: string;
  status: string;
  subscription_status: string;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubscriptionStatus, setSelectedSubscriptionStatus] = useState('all');
  const { toast } = useToast();

  // Verificar se é superadmin no carregamento
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Verificar se há uma sessão ativa
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session?.user) {
          console.log('❌ Usuário não autenticado');
          navigate('/login');
          return;
        }

        const user = sessionData.session.user;
        console.log('🔍 Verificando permissões de admin para:', user.email);

        // Verificar se é superadmin na tabela profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_superadmin')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('❌ Erro ao verificar perfil:', profileError);
          toast({
            title: "Erro ao verificar permissões",
            description: "Não foi possível verificar suas permissões de administrador",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        if (!profileData?.is_superadmin) {
          console.log('❌ Acesso negado: usuário não é superadmin');
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar o painel administrativo",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        console.log('✅ Acesso de superadmin autorizado para:', user.email);
      } catch (error: any) {
        console.error('❌ Erro inesperado ao verificar permissões:', error);
        toast({
          title: "Erro inesperado",
          description: "Não foi possível verificar suas permissões",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  // Carregar TODAS as lojas do banco de dados
  useEffect(() => {
    const loadAllStores = async () => {
      try {
        console.log('🔍 Carregando TODAS as lojas para o painel admin...');
        
        // Com as novas políticas RLS, superadmins podem ver todas as lojas
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Erro ao carregar lojas:', error);
          toast({
            title: "Erro ao carregar lojas",
            description: error.message,
            variant: "destructive"
          });
        } else {
          console.log('✅ Lojas carregadas para admin:', data?.length || 0, 'lojas encontradas');
          setStores(data || []);
        }
      } catch (error: any) {
        console.error('❌ Erro inesperado ao carregar lojas:', error);
        toast({
          title: "Erro inesperado",
          description: "Não foi possível carregar as lojas",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadAllStores();
  }, [toast]);

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || store.plan_type === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || store.status === selectedStatus;
    const matchesSubscriptionStatus = selectedSubscriptionStatus === 'all' || store.subscription_status === selectedSubscriptionStatus;
    
    return matchesSearch && matchesPlan && matchesStatus && matchesSubscriptionStatus;
  });

  const updateStoreStatus = async (storeId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('stores')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', storeId);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro ao atualizar status",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Atualizar estado local
      setStores(stores.map(store => 
        store.id === storeId 
          ? { ...store, status: newStatus, updated_at: new Date().toISOString() }
          : store
      ));

      toast({
        title: "Status atualizado",
        description: "Status da loja foi alterado com sucesso"
      });
    } catch (error: any) {
      console.error('Erro inesperado ao atualizar status:', error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível atualizar o status",
        variant: "destructive"
      });
    }
  };

  const getPlanLabel = (plan: string) => {
    const labels = {
      trial: 'Período de Teste',
      free: 'Gratuito',
      basic: 'Básico',
      premium: 'Premium'
    };
    return labels[plan as keyof typeof labels] || plan;
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      trial: 'bg-yellow-100 text-yellow-800',
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800'
    };
    return colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSubscriptionStatusColor = (status: string) => {
    const colors = {
      trial: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      canceled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSubscriptionStatusLabel = (status: string) => {
    const labels = {
      trial: 'Teste Grátis',
      active: 'Ativa',
      expired: 'Expirada',
      canceled: 'Cancelada'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      suspended: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Ativa',
      inactive: 'Inativa',
      suspended: 'Suspensa'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTrialExpiring = (trialEndDate: string | null) => {
    if (!trialEndDate) return false;
    const now = new Date();
    const trialEnd = new Date(trialEndDate);
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const getRemainingTrialDays = (trialEndDate: string | null) => {
    if (!trialEndDate) return 0;
    const now = new Date();
    const trialEnd = new Date(trialEndDate);
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Estatísticas baseadas nos dados reais
  const stats = {
    totalStores: stores.length,
    activeStores: stores.filter(s => s.status === 'active').length,
    paidPlans: stores.filter(s => s.plan_type !== 'trial' && s.plan_type !== 'free' && s.subscription_status === 'active').length,
    trialUsers: stores.filter(s => s.subscription_status === 'trial' || s.plan_type === 'free').length,
    expiredTrials: stores.filter(s => s.subscription_status === 'expired').length,
    expiringTrials: stores.filter(s => s.trial_ends_at && isTrialExpiring(s.trial_ends_at)).length,
    revenue: stores.filter(s => s.subscription_status === 'active' && s.plan_type !== 'trial' && s.plan_type !== 'free')
      .reduce((total, store) => {
        const amount = store.plan_type === 'basic' ? 29 : store.plan_type === 'premium' ? 49 : 0;
        return total + amount;
      }, 0)
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('mksimplo_user');
    toast({
      title: "Logout realizado",
      description: "Saindo do painel administrativo"
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Administração MKsimplo</h1>
                <p className="text-gray-600">Painel de controle da plataforma - Todas as lojas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                Super Admin
              </Badge>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Building className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <div className="text-xl font-bold text-blue-600">{stats.totalStores}</div>
                  <div className="text-xs text-gray-600">Total Lojas</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <div className="text-xl font-bold text-green-600">{stats.activeStores}</div>
                  <div className="text-xs text-gray-600">Ativas</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
                <div className="ml-3">
                  <div className="text-xl font-bold text-purple-600">{stats.paidPlans}</div>
                  <div className="text-xs text-gray-600">Pagantes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <div className="text-xl font-bold text-yellow-600">{stats.trialUsers}</div>
                  <div className="text-xs text-gray-600">Gratuito/Teste</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <UserCheck className="h-6 w-6 text-orange-600" />
                <div className="ml-3">
                  <div className="text-xl font-bold text-orange-600">{stats.expiringTrials}</div>
                  <div className="text-xs text-gray-600">Expirando</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <div className="text-xl font-bold text-green-600">R$ {stats.revenue}</div>
                  <div className="text-xs text-gray-600">Receita/mês</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar lojas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os planos</SelectItem>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="trial">Período de Teste</SelectItem>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSubscriptionStatus} onValueChange={setSelectedSubscriptionStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status assinatura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="trial">Teste Grátis</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="expired">Expirada</SelectItem>
                  <SelectItem value="canceled">Cancelada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status da loja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                  <SelectItem value="suspended">Suspensa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stores List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Lojas Cadastradas ({filteredStores.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStores.map(store => {
                const remainingDays = getRemainingTrialDays(store.trial_ends_at);
                const isExpiring = isTrialExpiring(store.trial_ends_at);
                
                return (
                  <div key={store.id} className={`border rounded-lg p-4 hover:bg-gray-50 ${isExpiring ? 'border-orange-300 bg-orange-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Store className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{store.name}</h3>
                            {isExpiring && (
                              <Badge variant="destructive" className="text-xs">
                                Teste expira em {remainingDays} dias
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{store.email}</p>
                          <p className="text-sm text-gray-500">Proprietário: {store.owner_name}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getPlanColor(store.plan_type)}>
                              {getPlanLabel(store.plan_type)}
                            </Badge>
                            <Badge className={getSubscriptionStatusColor(store.subscription_status)}>
                              {getSubscriptionStatusLabel(store.subscription_status)}
                            </Badge>
                            <Badge className={getStatusColor(store.status)}>
                              {getStatusLabel(store.status)}
                            </Badge>
                          </div>
                          {store.subscription_status === 'trial' && store.trial_ends_at && (
                            <div className="text-sm text-gray-500 mt-1">
                              Teste até: {formatDateTime(store.trial_ends_at)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Criada em: {formatDate(store.created_at)}
                        </div>
                        {store.phone && (
                          <div className="text-sm text-gray-500">
                            Tel: {store.phone}
                          </div>
                        )}
                        {store.cnpj && (
                          <div className="text-sm text-gray-500">
                            CNPJ: {store.cnpj}
                          </div>
                        )}
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {store.status === 'active' ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateStoreStatus(store.id, 'suspended')}
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              Suspender
                            </Button>
                          ) : store.status === 'suspended' ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateStoreStatus(store.id, 'active')}
                              className="text-green-600 hover:text-green-700"
                            >
                              Reativar
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateStoreStatus(store.id, 'active')}
                              className="text-green-600 hover:text-green-700"
                            >
                              Ativar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredStores.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma loja encontrada</h3>
                  <p>Tente ajustar os filtros ou aguarde novas lojas se cadastrarem</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
