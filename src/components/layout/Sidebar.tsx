
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  UserCheck,
  Settings, 
  CreditCard,
  Home,
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Vendas', href: '/sales', icon: ShoppingCart },
  { name: 'Vendedores', href: '/employees', icon: UserCheck },
  { name: 'Estoque', href: '/inventory', icon: Store },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Assinatura', href: '/subscription', icon: CreditCard },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('mksimplo_user');
      localStorage.removeItem('mksimplo_products');
      localStorage.removeItem('mksimplo_sales');
      window.dispatchEvent(new Event('storage'));
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
      
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-700">
      <div className="flex items-center h-16 px-6 border-b border-gray-700">
        <Store className="h-8 w-8 text-blue-400" />
        <span className="ml-2 text-xl font-semibold text-white">MK Simplo</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
};
