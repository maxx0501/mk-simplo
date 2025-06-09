
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthRegister } from '@/hooks/useAuthRegister';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { handleRegister, loading } = useAuthRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await handleRegister(ownerName, email, password);
    
    if (success) {
      // Limpar formulário
      setOwnerName('');
      setEmail('');
      setPassword('');
      
      // Aguardar um pouco e redirecionar para login
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ownerName">Seu Nome *</Label>
        <Input
          id="ownerName"
          placeholder="Seu nome completo"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          required
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Criando conta...' : 'Criar conta grátis'}
      </Button>
      
      <div className="text-sm text-gray-600 text-center">
        <p>Ao criar sua conta, você receberá um email de confirmação.</p>
        <p className="mt-1">Se não receber o email, você ainda pode fazer login após alguns minutos.</p>
      </div>
    </form>
  );
};
