
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { clearSession } from '@/utils/sessionManager';

const Login = () => {
  useEffect(() => {
    clearSession();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center mb-8 text-gray-600 hover:text-black">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao início
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Store className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-black">Entrar no MKsimplo</CardTitle>
            <CardDescription className="text-gray-600">
              Acesse sua conta para gerenciar seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Cadastre-se grátis
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
