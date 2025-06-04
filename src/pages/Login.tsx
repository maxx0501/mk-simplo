
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de login (aqui integraria com Supabase)
    try {
      if (email === 'admin@mksimplo.com') {
        // Login como superadmin
        localStorage.setItem('mksimplo_user', JSON.stringify({
          id: 'admin',
          email: 'admin@mksimplo.com',
          role: 'superadmin',
          store_id: null
        }));
        navigate('/admin');
      } else {
        // Login como loja
        localStorage.setItem('mksimplo_user', JSON.stringify({
          id: '1',
          email: email,
          role: 'owner',
          store_id: '1',
          store_name: 'Loja Exemplo'
        }));
        navigate('/dashboard');
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao MKsimplo"
      });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center mb-8 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao início
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Store className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Entrar no MKsimplo</CardTitle>
            <CardDescription>
              Acesse sua conta para gerenciar sua loja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Cadastre-se grátis
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p className="font-medium">Para testar:</p>
              <p>• Loja: qualquer@email.com</p>
              <p>• Admin: admin@mksimplo.com</p>
              <p>• Senha: qualquer</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
