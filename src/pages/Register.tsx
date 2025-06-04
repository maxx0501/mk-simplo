
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Iniciando registro com email:', email);
      
      // Fazer logout antes de criar nova conta para evitar conflitos
      await supabase.auth.signOut();
      localStorage.removeItem('mksimplo_user');
      
      // Criar o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: ownerName,
            store_name: storeName,
            phone: phone
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (authError) {
        console.error('Erro no registro:', authError);
        
        if (authError.message === "User already registered") {
          toast({
            title: "Email já cadastrado",
            description: "Este email já possui uma conta. Tente fazer login ou use outro email.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: authError.message || "Tente novamente",
            variant: "destructive"
          });
        }
        return;
      }

      console.log('Usuário criado:', authData);

      if (authData.user) {
        // Criar registro na tabela stores
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .insert({
            name: storeName,
            email: email.trim(),
            owner_name: ownerName,
            phone: phone || null,
            cnpj: cnpj || null,
            plan_type: 'trial',
            status: 'active',
            subscription_status: 'trial',
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .single();

        if (storeError) {
          console.error('Erro ao criar loja:', storeError);
          toast({
            title: "Erro ao criar loja",
            description: "Usuário criado mas houve problema ao configurar a loja. Entre em contato com o suporte.",
            variant: "destructive"
          });
        } else {
          console.log('Loja criada com sucesso:', storeData);

          // Criar registro na tabela user_stores para associar o usuário à loja
          const { error: userStoreError } = await supabase
            .from('user_stores')
            .insert({
              user_id: authData.user.id,
              store_id: storeData.id,
              role: 'owner'
            });

          if (userStoreError) {
            console.error('Erro ao associar usuário à loja:', userStoreError);
          } else {
            console.log('Usuário associado à loja com sucesso');
          }
        }

        if (!authData.user.email_confirmed_at) {
          toast({
            title: "Conta criada com sucesso!",
            description: "Verifique seu email para confirmar a conta antes de fazer login.",
          });
          navigate('/login');
        } else {
          console.log('Email já confirmado, configurando sessão');
          localStorage.setItem('mksimplo_user', JSON.stringify({
            id: authData.user.id,
            email: authData.user.email,
            role: 'owner',
            store_id: storeData?.id || null,
            store_name: storeName
          }));
          
          toast({
            title: "Conta criada com sucesso!",
            description: "Bem-vindo ao MKsimplo!"
          });
          navigate('/dashboard');
        }
      } else {
        toast({
          title: "Conta criada com sucesso!",
          description: "Faça login para acessar sua conta.",
        });
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Tente novamente",
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
            <CardTitle className="text-2xl">Criar conta no MKsimplo</CardTitle>
            <CardDescription>
              Comece grátis a gerenciar sua loja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja *</Label>
                <Input
                  id="storeName"
                  placeholder="Ex: Loja da Maria"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownerName">Seu Nome *</Label>
                <Input
                  id="ownerName"
                  placeholder="Seu nome completo"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="phone">WhatsApp (opcional)</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0001-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar conta grátis'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
