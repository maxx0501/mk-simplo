
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { registerUser } from '@/services/authService';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData.ownerName, formData.email, formData.password, formData.companyName);
      
      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta e depois faça login."
      });
      
      // Resetar formulário
      setFormData({
        ownerName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: ''
      });
      
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ownerName">Nome Completo</Label>
            <Input
              id="ownerName"
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              placeholder="Opcional"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
