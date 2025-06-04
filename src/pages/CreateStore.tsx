
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStoreCreation } from '@/hooks/useStoreCreation';

const CreateStore = () => {
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [cnpj, setCnpj] = useState('');
  const navigate = useNavigate();
  const { createStore, loading } = useStoreCreation();

  useEffect(() => {
    // Verificar se o usuário está logado
    const user = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    
    if (!user.id) {
      navigate('/login');
      return;
    }
    
    // Se já tem loja, redirecionar para dashboard
    if (user.store_id) {
      navigate('/dashboard');
      return;
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeName.trim()) {
      return;
    }
    
    const success = await createStore(storeName, phone, cnpj);
    
    if (success) {
      // Redirecionar para dashboard após criar a loja
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Store className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Criar sua Loja</CardTitle>
            <CardDescription>
              Complete seu cadastro criando sua primeira loja no MKsimplo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja *</Label>
                <Input
                  id="storeName"
                  placeholder="Ex: Loja da Maria"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0001-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading || !storeName.trim()}
              >
                {loading ? 'Criando loja...' : 'Criar Loja'}
              </Button>
            </form>
            
            <div className="mt-6 text-sm text-gray-600 text-center">
              <p>Você poderá alterar essas informações depois nas configurações.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateStore;
