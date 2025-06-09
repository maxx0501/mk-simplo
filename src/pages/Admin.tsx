
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Crown,
  LogOut,
  Building,
  RefreshCw,
  Trash2,
  Users,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Store {
  id: string;
  name: string;
  owner_name: string;
  plan_type: string;
  created_at: string;
  status: string;
  email: string;
  trial_ends_at?: string;
}

interface AdminStats {
  totalStores: number;
  activeSubscriptions: number;
  trialStores: number;
  totalRevenue: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalStores: 0,
    activeSubscriptions: 0,
    trialStores: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userValidated, setUserValidated] = useState(false);
  const [deletingStore, setDeletingStore] = useState<string | null>(null);
  const { toast } = useToast();

  // Verificar se é superadmin no carregamento
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const userData = localStorage.getItem('mksimplo_user');
        
        if (!userData) {
          console.log('❌ Usuário não autenticado');
          navigate('/login');
          return;
        }

        const user = JSON.parse(userData);
        console.log('🔍 Verificando permissões de admin para:', user.email);

        // Para usuários reais, verificar se tem role superadmin
        if (user.role === 'superadmin') {
          console.log('✅ Acesso de superadmin autorizado');
          setUserValidated(true);
          return;
        }

        // Verificar sessão do Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session?.user) {
          console.log('❌ Sessão inválida');
          navigate('/login');
          return;
        }

        // Verificar no banco se é superadmin
        const { data: adminData, error } = await supabase
          .from('platform_admins')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ Erro ao verificar admin:', error);
        }

        if (adminData) {
          console.log('✅ Usuário é admin');
          setUserValidated(true);
          return;
        }

        // Se chegou até aqui, não tem permissão
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel administrativo",
          variant: "destructive"
        });
        navigate('/dashboard');
        
      } catch (error: any) {
        console.error('❌ Erro ao verificar permissões:', error);
        navigate('/dashboard');
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  // Função para carregar lojas e estatísticas
  const loadStores = async () => {
    if (!userValidated) return;

    try {
      setLoading(true);
      console.log('🔍 Carregando lojas do banco...');
      
      // Use type assertion to bypass TypeScript errors temporarily
      const { data: storesData, error } = await (supabase as any)
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro na consulta:', error);
        toast({
          title: "Erro ao carregar lojas",
          description: "Não foi possível carregar as lojas: " + error.message,
          variant: "destructive"
        });
        setStores([]);
        return;
      }

      console.log('📊 Lojas encontradas:', storesData?.length || 0);
      setStores(storesData || []);

      // Calcular estatísticas
      const totalStores = storesData?.length || 0;
      const activeSubscriptions = storesData?.filter((store: any) => store.plan_type === 'pro').length || 0;
      const trialStores = storesData?.filter((store: any) => store.plan_type === 'trial').length || 0;
      const totalRevenue = activeSubscriptions * 29.90; // Assumindo preço do plano Pro
      
      setStats({
        totalStores,
        activeSubscriptions,
        trialStores,
        totalRevenue
      });
      
    } catch (error: any) {
      console.error('❌ Erro inesperado:', error);
      toast({
        title: "Erro ao carregar lojas",
        description: "Não foi possível carregar as lojas: " + error.message,
        variant: "destructive"
      });
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar dados
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStores();
    setRefreshing(false);
    toast({
      title: "Dados atualizados",
      description: "As informações das lojas foram recarregadas."
    });
  };

  // Função para remover loja com correção
  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (!userValidated) return;

    try {
      setDeletingStore(storeId);
      console.log('🗑️ Removendo loja:', storeName);

      // Use type assertion to bypass TypeScript errors temporarily
      const { error } = await (supabase as any)
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) {
        console.error('❌ Erro ao deletar loja:', error);
        toast({
          title: "Erro ao remover loja",
          description: "Não foi possível remover a loja: " + error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Loja removida com sucesso');
      
      toast({
        title: "Loja removida",
        description: `A loja "${storeName}" foi removida com sucesso.`
      });

      // Recarregar a lista de lojas
      await loadStores();
      
    } catch (error: any) {
      console.error('❌ Erro inesperado ao deletar:', error);
      toast({
        title: "Erro ao remover loja",
        description: "Erro inesperado: " + error.message,
        variant: "destructive"
      });
    } finally {
      setDeletingStore(null);
    }
  };

  // Carregar lojas quando o usuário for validado
  useEffect(() => {
    loadStores();
  }, [userValidated]);

  const getPlanLabel = (plan: string) => {
    const labels = {
      trial: 'Período de Teste',
      pro: 'Pro',
      unknown: 'Desconhecido'
    };
    return labels[plan as keyof typeof labels] || plan;
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      trial: 'bg-yellow-100 text-yellow-800',
      pro: 'bg-blue-100 text-blue-800',
      unknown: 'bg-red-100 text-red-800'
    };
    return colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrialStatus = (store: Store) => {
    if (store.plan_type !== 'trial' || !store.trial_ends_at) return null;
    
    const now = new Date();
    const trialEnd = new Date(store.trial_ends_at);
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expirado';
    return `${diffDays} dias restantes`;
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

  if (loading || !userValidated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!userValidated ? 'Validando permissões...' : 'Carregando lojas...'}
          </p>
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
              <Crown className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-black">Painel Administrativo</h1>
                <p className="text-gray-600">Gestão de lojas do sistema</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
                Admin
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
        {/* Estatísticas expandidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Building className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalStores}</div>
                  <div className="text-sm text-gray-600">Total de Lojas</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Store className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</div>
                  <div className="text-sm text-gray-600">Planos Pro Ativos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-yellow-600">{stats.trialStores}</div>
                  <div className="text-sm text-gray-600">Em Período de Teste</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-purple-600">R$ {stats.totalRevenue.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Receita Mensal</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Lojas */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-black">Lojas Cadastradas ({stores.length})</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stores.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Nenhuma loja encontrada</h3>
                <p className="mb-4">Não há lojas cadastradas no sistema ainda.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black font-semibold">Nome da Loja</TableHead>
                    <TableHead className="text-black font-semibold">Proprietário</TableHead>
                    <TableHead className="text-black font-semibold">Email</TableHead>
                    <TableHead className="text-black font-semibold">Plano</TableHead>
                    <TableHead className="text-black font-semibold">Status do Teste</TableHead>
                    <TableHead className="text-black font-semibold">Data de Criação</TableHead>
                    <TableHead className="text-black font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium text-black">{store.name}</TableCell>
                      <TableCell className="text-gray-700">{store.owner_name}</TableCell>
                      <TableCell className="text-gray-700">{store.email}</TableCell>
                      <TableCell>
                        <Badge className={getPlanColor(store.plan_type)}>
                          {getPlanLabel(store.plan_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {store.plan_type === 'trial' ? (
                          <span className={`text-sm ${
                            getTrialStatus(store) === 'Expirado' 
                              ? 'text-red-600 font-medium' 
                              : 'text-yellow-600'
                          }`}>
                            {getTrialStatus(store)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700">{formatDate(store.created_at)}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={deletingStore === store.id}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              {deletingStore === store.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-black">Remover Loja</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600">
                                Tem certeza que deseja remover a loja "{store.name}"? 
                                Esta ação não pode ser desfeita e todos os dados serão perdidos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteStore(store.id, store.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
