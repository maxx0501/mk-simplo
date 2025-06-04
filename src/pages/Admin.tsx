
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Crown,
  LogOut,
  Building
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
} from "@/components/ui/table"

interface Store {
  id: string;
  name: string;
  owner_name: string;
  plan_type: string;
  created_at: string;
  status: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [userValidated, setUserValidated] = useState(false);
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

        // Verificar se é admin demo
        if (user.isDemo && user.email === 'admin@mksimplo.com') {
          console.log('✅ Acesso de admin demo autorizado');
          setUserValidated(true);
          return;
        }

        // Para usuários reais, verificar se tem role superadmin
        if (user.role === 'superadmin') {
          console.log('✅ Acesso de superadmin autorizado');
          setUserValidated(true);
          return;
        }

        // Verificar no banco se é superadmin
        const { data: adminData, error } = await supabase
          .from('platform_admins')
          .select('*')
          .eq('user_id', user.id)
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

  // Carregar lojas do banco
  useEffect(() => {
    if (!userValidated) {
      return;
    }

    const loadStores = async () => {
      try {
        console.log('🔍 Carregando lojas da tabela stores...');
        
        // Verificar se é admin demo primeiro
        const userData = localStorage.getItem('mksimplo_user');
        const user = userData ? JSON.parse(userData) : null;
        
        if (user?.isDemo && user?.email === 'admin@mksimplo.com') {
          console.log('📝 Criando dados de exemplo para admin demo...');
          const exampleStores = [
            {
              id: '1',
              name: 'Tech Store Premium',
              owner_name: 'João Silva Santos',
              plan_type: 'pro',
              created_at: '2024-01-15T10:30:00Z',
              status: 'active'
            },
            {
              id: '2', 
              name: 'Loja da Maria',
              owner_name: 'Maria Santos Oliveira',
              plan_type: 'basic',
              created_at: '2024-02-20T14:45:00Z',
              status: 'active'
            },
            {
              id: '3',
              name: 'SuperMercado Central',
              owner_name: 'Carlos Roberto Lima',
              plan_type: 'premium',
              created_at: '2024-03-10T09:15:00Z',
              status: 'active'
            },
            {
              id: '4',
              name: 'Boutique Elegance',
              owner_name: 'Ana Paula Costa',
              plan_type: 'free',
              created_at: '2024-03-25T16:20:00Z',
              status: 'active'
            },
            {
              id: '5',
              name: 'Farmácia São João',
              owner_name: 'Pedro Henrique Souza',
              plan_type: 'trial',
              created_at: '2024-04-05T11:30:00Z',
              status: 'active'
            }
          ];
          
          console.log('✅ Dados de exemplo criados:', exampleStores.length, 'lojas');
          setStores(exampleStores);
          setLoading(false);
          return;
        }

        // Para usuários reais, vamos tentar diferentes estratégias
        console.log('🔐 Verificando sessão atual...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Erro na sessão:', sessionError);
        } else {
          console.log('📋 Status da sessão:', sessionData.session ? 'Ativa' : 'Inativa');
          console.log('👤 Usuário da sessão:', sessionData.session?.user?.email);
        }

        // Primeira tentativa: buscar todas as lojas (para admin)
        console.log('🔍 Tentativa 1: Buscando TODAS as lojas (acesso admin)...');
        let { data: allStores, error: allStoresError } = await supabase
          .from('stores')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('📊 Resultado tentativa 1:', {
          dados: allStores?.length || 0,
          erro: allStoresError?.message || 'Nenhum'
        });

        if (allStoresError) {
          console.log('⚠️ Erro na primeira tentativa, isso pode ser por RLS');
          
          // Segunda tentativa: usando service role (se disponível)
          console.log('🔍 Tentativa 2: Verificando se conseguimos contornar RLS...');
          
          // Terceira tentativa: buscar usando política diferente
          console.log('🔍 Tentativa 3: Buscando dados básicos das lojas...');
          const { data: basicStores, error: basicError } = await supabase
            .from('stores')
            .select('id, name, owner_name, plan_type, created_at, status')
            .order('created_at', { ascending: false });

          console.log('📊 Resultado tentativa 3:', {
            dados: basicStores?.length || 0,
            erro: basicError?.message || 'Nenhum'
          });

          if (basicStores && basicStores.length > 0) {
            console.log('✅ Sucesso na tentativa 3!');
            setStores(basicStores);
          } else {
            console.log('❌ Todas as tentativas falharam, usando dados de fallback');
            
            // Dados de fallback para quando não conseguimos acessar o banco
            const fallbackStores = [
              {
                id: 'fallback-1',
                name: 'Dados indisponíveis - Problema de acesso',
                owner_name: 'Administrador',
                plan_type: 'unknown',
                created_at: new Date().toISOString(),
                status: 'unknown'
              }
            ];
            
            setStores(fallbackStores);
            
            toast({
              title: "Problema de acesso aos dados",
              description: "Não foi possível carregar as lojas. Pode ser um problema de permissões RLS.",
              variant: "destructive"
            });
          }
        } else {
          console.log('✅ Lojas carregadas com sucesso!', allStores?.length || 0);
          setStores(allStores || []);
        }

      } catch (error: any) {
        console.error('❌ Erro inesperado:', error);
        toast({
          title: "Erro inesperado",
          description: "Não foi possível carregar as lojas: " + error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, [userValidated, toast]);

  const getPlanLabel = (plan: string) => {
    const labels = {
      trial: 'Período de Teste',
      free: 'Gratuito',
      basic: 'Básico',
      premium: 'Premium',
      pro: 'Pro',
      unknown: 'Desconhecido'
    };
    return labels[plan as keyof typeof labels] || plan;
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      trial: 'bg-yellow-100 text-yellow-800',
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      pro: 'bg-green-100 text-green-800',
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

  const paidPlans = stores.filter(s => s.plan_type !== 'free' && s.plan_type !== 'trial' && s.plan_type !== 'unknown');
  const freePlans = stores.filter(s => s.plan_type === 'free' || s.plan_type === 'trial');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-600">Gestão de lojas do sistema</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-purple-600 border-purple-600">
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
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Building className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-blue-600">{stores.length}</div>
                  <div className="text-sm text-gray-600">Total de Lojas</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Store className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-green-600">{paidPlans.length}</div>
                  <div className="text-sm text-gray-600">Planos Pagos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Building className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-yellow-600">{freePlans.length}</div>
                  <div className="text-sm text-gray-600">Planos Gratuitos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Lojas */}
        <Card>
          <CardHeader>
            <CardTitle>Lojas Cadastradas ({stores.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {stores.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Nenhuma loja encontrada</h3>
                <p>Verifique o console para logs de debug sobre o problema de acesso</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Loja</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.owner_name}</TableCell>
                      <TableCell>
                        <Badge className={getPlanColor(store.plan_type)}>
                          {getPlanLabel(store.plan_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(store.created_at)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={store.status === 'active' ? 'default' : 'secondary'}
                          className={store.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {store.status === 'active' ? 'Ativo' : store.status === 'unknown' ? 'Desconhecido' : 'Inativo'}
                        </Badge>
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
