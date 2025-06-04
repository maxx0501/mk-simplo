
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
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <Store className="h-8 w-8 text-blue-400" />
          <span className="ml-2 text-xl font-bold text-sidebar-foreground">MKsimplo</span>
        </div>

        {/* Store Name */}
        <div className="mt-5 px-4">
          <p className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
            Loja Atual
          </p>
          <p className="text-sm font-medium text-sidebar-foreground mt-1">
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
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
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
        <div className="flex-shrink-0 flex border-t border-sidebar-border p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">
                  {user.email}
                </p>
                <p className="text-xs font-medium text-sidebar-foreground/70">
                  {user.role === 'owner' ? 'Proprietário' : 'Vendedor'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
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
