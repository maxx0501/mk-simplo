
import React, { useState, useEffect } from 'react';
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
  Plus,
  Edit,
  Trash2,
  Eye,
  Building,
  Crown
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
  created_at: string;
  updated_at: string;
}

// Sample data for demonstration
const sampleStores: Store[] = [
  {
    id: '1',
    name: 'Loja do João',
    email: 'joao@lojadojoao.com',
    phone: '(11) 99999-1234',
    cnpj: '12.345.678/0001-90',
    owner_name: 'João Silva',
    plan_type: 'premium',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Tech Store',
    email: 'contato@techstore.com',
    phone: '(11) 88888-5678',
    cnpj: '98.765.432/0001-10',
    owner_name: 'Maria Santos',
    plan_type: 'basic',
    status: 'active',
    created_at: '2024-02-01T14:30:00Z',
    updated_at: '2024-02-01T14:30:00Z'
  },
  {
    id: '3',
    name: 'Moda & Estilo',
    email: 'admin@modaestilo.com',
    phone: '(21) 77777-9999',
    cnpj: '11.222.333/0001-44',
    owner_name: 'Ana Costa',
    plan_type: 'free',
    status: 'suspended',
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-03-10T16:45:00Z'
  },
  {
    id: '4',
    name: 'Casa & Decoração',
    email: 'vendas@casadecor.com',
    phone: '(31) 66666-7777',
    cnpj: '55.666.777/0001-88',
    owner_name: 'Carlos Oliveira',
    plan_type: 'basic',
    status: 'inactive',
    created_at: '2024-03-05T11:20:00Z',
    updated_at: '2024-03-05T11:20:00Z'
  }
];

const Admin = () => {
  const [stores, setStores] = useState<Store[]>(sampleStores);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { toast } = useToast();

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || store.plan_type === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || store.status === selectedStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const updateStoreStatus = (storeId: string, newStatus: string) => {
    setStores(stores.map(store => 
      store.id === storeId 
        ? { ...store, status: newStatus, updated_at: new Date().toISOString() }
        : store
    ));

    toast({
      title: "Status atualizado",
      description: "Status da loja foi alterado com sucesso"
    });
  };

  const getPlanLabel = (plan: string) => {
    const labels = {
      free: 'Gratuito',
      basic: 'Básico',
      premium: 'Premium'
    };
    return labels[plan as keyof typeof labels] || plan;
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800'
    };
    return colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
                <p className="text-gray-600">Painel de controle da plataforma</p>
              </div>
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Super Admin
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {stores.length}
                  </div>
                  <div className="text-sm text-gray-600">Total de Lojas</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-green-600">
                    {stores.filter(s => s.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Lojas Ativas</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {stores.filter(s => s.plan_type !== 'free').length}
                  </div>
                  <div className="text-sm text-gray-600">Planos Pagos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {stores.filter(s => s.created_at >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).length}
                  </div>
                  <div className="text-sm text-gray-600">Novas (30 dias)</div>
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
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                  <SelectItem value="suspended">Suspensa</SelectItem>
                </SelectContent>
              </Select>

              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Loja
              </Button>
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
              {filteredStores.map(store => (
                <div key={store.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Store className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{store.name}</h3>
                        <p className="text-gray-600">{store.email}</p>
                        <p className="text-sm text-gray-500">Proprietário: {store.owner_name}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getPlanColor(store.plan_type)}>
                            {getPlanLabel(store.plan_type)}
                          </Badge>
                          <Badge className={getStatusColor(store.status)}>
                            {getStatusLabel(store.status)}
                          </Badge>
                        </div>
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
              ))}

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
