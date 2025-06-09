
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { clearSession } from '@/utils/sessionManager';

const Register = () => {
  React.useEffect(() => {
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
            <CardTitle className="text-3xl font-bold text-dark-blue">Criar conta no MKsimplo</CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2">
              Crie sua conta e comece a gerenciar sua loja
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RegisterForm />
            
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-golden hover:text-dark-blue font-semibold transition-colors">
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
