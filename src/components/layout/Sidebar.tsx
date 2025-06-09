
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Settings,
  LogOut,
  ArrowUp,
  Crown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Vendas', href: '/sales', icon: ShoppingCart },
  { name: 'Estoque', href: '/inventory', icon: ArrowUp },
  { name: 'Relatórios', href: '/reports', icon: TrendingUp },
  { name: 'Vendedores', href: '/users', icon: Users },
  { name: 'Assinatura', href: '/subscription', icon: Crown },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = () => {
      const userData = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
      setUser(userData);
    };

    // Carregar dados do usuário
    loadUser();

    // Escutar mudanças no localStorage (quando o nome da loja é atualizado)
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Iniciando logout...');
      
      // Fazer logout completo do Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Erro no logout do Supabase:', error);
      }
      
      console.log('Logout do Supabase realizado');
      
      // Limpar completamente o armazenamento local
      localStorage.clear();
      sessionStorage.clear();
      
      // Mostrar toast de sucesso
      toast({
        title: "Logout realizado",
        description: "Até logo!"
      });
      
      console.log('Redirecionando para home...');
      
      // Aguardar um pouco para garantir que a limpeza foi feita
      setTimeout(() => {
        navigate('/');
      }, 100);
      
    } catch (error: any) {
      console.error('Erro durante logout:', error);
      
      // Mesmo com erro, limpar localStorage e redirecionar
      localStorage.clear();
      sessionStorage.clear();
      
      toast({
        title: "Logout realizado",
        description: "Sessão finalizada"
      });
      
      navigate('/');
    }
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen flex flex-col">
      <div className="flex flex-col flex-grow">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 pt-5">
          <Store className="h-8 w-8 text-blue-400" />
          <span className="ml-2 text-xl font-bold text-white">MKsimplo</span>
        </div>

        {/* Store Name */}
        <div className="mt-5 px-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Loja
          </p>
          <p className="text-sm font-medium text-white mt-1">
            {user?.store_name || 'Sem loja definida'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                )
              }
            >
              <item.icon
                className="mr-3 flex-shrink-0 h-5 w-5"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User info and logout */}
        <div className="flex-shrink-0 flex border-t border-gray-800 p-4 mt-auto">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {user?.email}
                </p>
                <p className="text-xs font-medium text-gray-400">
                  {user?.role === 'owner' ? 'Proprietário' : 'Vendedor'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
