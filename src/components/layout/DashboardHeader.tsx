
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const DashboardHeader = () => {
  const [user, setUser] = useState<any>(null);
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    setUser(userData);
    setEmpresaId(userData.empresa_id || null);
  }, []);

  const copyEmpresaId = async () => {
    if (empresaId) {
      await navigator.clipboard.writeText(empresaId);
      setCopied(true);
      toast({
        title: "ID copiado!",
        description: "ID da empresa copiado para a área de transferência"
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('mksimplo_user');
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">MKSimplo</h1>
            {empresaId && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">ID:</span>
                <div className="flex items-center bg-gray-100 rounded px-2 py-1">
                  <code className="text-xs text-gray-800 mr-2">
                    {empresaId.slice(0, 8)}...
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyEmpresaId}
                    className="h-6 w-6 p-0"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user?.empresa_nome && (
              <span className="text-sm text-gray-600">{user.empresa_nome}</span>
            )}
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
