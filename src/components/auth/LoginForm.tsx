
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthLogin } from '@/hooks/useAuthLogin';
import { useAuthRegister } from '@/hooks/useAuthRegister';
import { Mail } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResend, setShowResend] = useState(false);
  const { handleLogin, loading: loginLoading } = useAuthLogin();
  const { resendConfirmation, loading: resendLoading } = useAuthRegister();

  const loading = loginLoading || resendLoading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await handleLogin(email, password);
    
    // Se o resultado for undefined, significa que houve erro de email não confirmado
    if (result === undefined && email) {
      setShowResend(true);
    }
  };

  const handleResendConfirmation = async () => {
    if (email) {
      await resendConfirmation(email);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      {showResend && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Email não confirmado
            </span>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            Você precisa confirmar seu email antes de fazer login. Não recebeu o email?
          </p>
          <Button
            onClick={handleResendConfirmation}
            variant="outline"
            size="sm"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Reenviando...' : 'Reenviar email de confirmação'}
          </Button>
        </div>
      )}
    </div>
  );
};
