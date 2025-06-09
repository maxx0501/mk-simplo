
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, ArrowLeft, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { clearSession } from '@/utils/sessionManager';

const Login = () => {
  useEffect(() => {
    clearSession();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center mb-8 text-gray-600 hover:text-dark-blue transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao início
        </Link>

        <Card className="card-modern shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 bg-gradient-to-br from-dark-blue to-golden rounded-xl flex items-center justify-center">
                <Store className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-dark-blue">Entrar no MKsimplo</CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2">
              Acesse sua conta para gerenciar seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginForm />
            
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-golden hover:text-dark-blue font-semibold transition-colors">
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
