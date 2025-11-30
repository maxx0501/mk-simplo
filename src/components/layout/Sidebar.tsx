
import React from 'react';
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
  Globe, 
  Settings,
  LogOut,
  ArrowUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Vendas', href: '/sales', icon: ShoppingCart },
  { name: 'Estoque', href: '/inventory', icon: ArrowUp },
  { name: 'Relatórios', href: '/reports', icon: TrendingUp },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Catálogo', href: '/catalog', icon: Globe },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('mksimplo_user');
    toast({
      title: "Logout realizado",
      description: "Até logo!"
    });
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <Store className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">MKsimplo</span>
        </div>

        {/* Store Name */}
        <div className="mt-5 px-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Loja Atual
          </p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {user.store_name || 'Loja Exemplo'}
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
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
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
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  {user.role === 'owner' ? 'Proprietário' : 'Vendedor'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
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
