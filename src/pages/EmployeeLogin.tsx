
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    storeId: '',
    login: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.storeId || !formData.login || !formData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('authenticate_employee', {
        store_id_param: formData.storeId,
        login_param: formData.login,
        password_param: formData.password
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "Credenciais inválidas",
          description: "Verifique ID da loja, login e senha",
          variant: "destructive"
        });
        return;
      }

      const employeeData = data[0];
      const employeeInfo = {
        id: employeeData.employee_id,
        name: employeeData.employee_name,
        login: formData.login,
        store_id: formData.storeId,
        store_name: employeeData.store_name,
        role: 'employee'
      };

      localStorage.setItem('mksimplo_employee', JSON.stringify(employeeInfo));
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${employeeData.employee_name}!`
      });

      navigate('/employee-sales');
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center">
            <Store className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Login de Vendedor</CardTitle>
          <p className="text-gray-600">Acesse o sistema de vendas</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="storeId">ID da Loja</Label>
              <Input
                id="storeId"
                type="text"
                value={formData.storeId}
                onChange={(e) => setFormData(prev => ({ ...prev, storeId: e.target.value }))}
                placeholder="ID da sua loja"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                type="text"
                value={formData.login}
                onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                placeholder="Seu login"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Sua senha"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              É proprietário de loja?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-yellow-600 hover:text-yellow-800"
                onClick={() => navigate('/login')}
              >
                Fazer login aqui
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeLogin;
