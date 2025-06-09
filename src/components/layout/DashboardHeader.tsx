
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, RefreshCw, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationDropdown } from '../NotificationDropdown';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const DashboardHeader = () => {
  const [empresa, setEmpresa] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadEmpresaData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('usuarios')
        .select(`
          *,
          empresas (*)
        `)
        .eq('id', user.id)
        .single();

      if (userData?.empresas) {
        setEmpresa(userData.empresas);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error);
    }
  };

  useEffect(() => {
    loadEmpresaData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadEmpresaData().finally(() => setRefreshing(false));
  };

  const copyEmpresaId = () => {
    if (empresa?.id) {
      navigator.clipboard.writeText(empresa.id);
      setCopied(true);
      toast({
        title: "ID copiado!",
        description: "ID da empresa copiado para a área de transferência"
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getUserDisplayName = () => {
    const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
    return userData.nome || userData.email?.split('@')[0] || 'Usuário';
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4 md:ml-0">
            <h2 className="text-lg font-semibold text-black">
              {empresa?.nome || 'Carregando...'}
            </h2>
            <p className="text-sm text-gray-500">
              Bem-vindo, {getUserDisplayName()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-gray-600 hover:text-gray-900 rounded-lg"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          {empresa?.id && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyEmpresaId}
              className="text-gray-600 hover:text-gray-900 border-gray-200 rounded-lg"
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              ID: {empresa.id.slice(-6)}
            </Button>
          )}
          
          <Badge 
            variant="outline" 
            className="bg-yellow-50 text-yellow-700 border-yellow-300 cursor-pointer transition-all duration-200 font-medium px-3 py-1 border-2 rounded-lg"
            onClick={() => navigate('/subscription')}
          >
            Teste Grátis
          </Badge>
          
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
};
