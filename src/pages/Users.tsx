
import React, { useEffect, useState } from 'react';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Trash2, UserPlus, Shield } from 'lucide-react';
import { StoreAccessOptions } from '@/components/store/StoreAccessOptions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
  login: string;
  created_at: string;
}

export default function UsersPage() {
  const [user, setUser] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    login: '',
    password: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);

    if (userData.store_id && userData.role === 'owner') {
      fetchEmployees(userData.store_id);
    }
  }, []);

  const fetchEmployees = async (storeId: string) => {
    try {
      const { data, error } = await supabase
        .from('store_employees')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os vendedores",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.store_id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('store_employees')
        .insert({
          store_id: user.store_id,
          name: formData.name,
          login: formData.login,
          password_hash: `crypt('${formData.password}', gen_salt('bf'))`
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('Já existe um vendedor com este login');
        }
        throw error;
      }

      toast({
        title: "✅ Sucesso",
        description: "Vendedor adicionado com sucesso!"
      });

      resetForm();
      fetchEmployees(user.store_id);
    } catch (error: any) {
      console.error('Erro ao adicionar vendedor:', error);
      toast({
        title: "❌ Erro",
        description: error.message || "Não foi possível adicionar o vendedor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId: string) => {
    if (!confirm('Tem certeza que deseja excluir este vendedor?')) return;

    try {
      const { error } = await supabase
        .from('store_employees')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;
      
      toast({
        title: "✅ Sucesso",
        description: "Vendedor excluído com sucesso!"
      });
      
      fetchEmployees(user.store_id);
    } catch (error) {
      console.error('Erro ao excluir vendedor:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível excluir o vendedor",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      login: '',
      password: ''
    });
    setShowForm(false);
  };

  // Se o usuário não tem loja, mostrar opções de acesso
  if (!user?.store_id) {
    return (
      <ModernDashboardLayout>
        <StoreAccessOptions />
      </ModernDashboardLayout>
    );
  }

  // Se não é proprietário, mostrar acesso negado
  if (user.role !== 'owner') {
    return (
      <ModernDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100/80 to-red-200/80 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Shield className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                🔒 Acesso Restrito
              </h3>
              <p className="text-gray-500">
                Apenas proprietários podem gerenciar vendedores
              </p>
            </CardContent>
          </Card>
        </div>
      </ModernDashboardLayout>
    );
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20">
        {/* Header melhorado */}
        <div className="bg-gradient-to-r from-white to-blue-50/50 p-8 rounded-3xl border border-blue-100/50 shadow-xl backdrop-blur-sm animate-in slide-in-from-top duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center gap-3 animate-in fade-in duration-1000">
                👥 Vendedores
              </h1>
              <p className="text-gray-600 text-lg">Gerencie os vendedores da sua loja</p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              <Plus className="mr-2 h-5 w-5" />
              ➕ Adicionar Vendedor
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden animate-in slide-in-from-top duration-500">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <CardTitle className="text-2xl font-bold">👤 Novo Vendedor</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">👤 Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-12 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login" className="text-gray-700 font-medium">🔑 Login *</Label>
                    <Input
                      id="login"
                      value={formData.login}
                      onChange={(e) => setFormData({...formData, login: e.target.value})}
                      placeholder="Login único para o vendedor"
                      className="h-12 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">🔒 Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-12 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                  >
                    {loading ? '⏳ Adicionando...' : '➕ Adicionar Vendedor'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="px-8 py-3 border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  >
                    ❌ Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Employees List */}
        {employees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee, index) => (
              <Card 
                key={employee.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden animate-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100/80 to-blue-200/80 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">👤 {employee.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">🔑 Login: {employee.login}</p>
                      <p className="text-sm text-gray-500">
                        📅 Criado em: {new Date(employee.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(employee.id)}
                      className="border-red-200/50 text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/50">
                    <span className="px-3 py-1 bg-green-100/80 text-green-700 rounded-full text-xs font-medium backdrop-blur-sm">
                      ✅ Ativo
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 animate-in fade-in duration-1000">
            <CardContent className="text-center py-16">
              <div className="space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100/80 to-yellow-100/80 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm shadow-lg">
                  <Users className="h-12 w-12 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    👥 Nenhum vendedor cadastrado
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    Adicione vendedores para sua equipe
                  </p>
                </div>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  ➕ Adicionar Primeiro Vendedor
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ModernDashboardLayout>
  );
}
