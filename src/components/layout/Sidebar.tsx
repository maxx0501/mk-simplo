
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Boxes,
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Vendas', href: '/sales', icon: ShoppingCart },
  { name: 'Estoque', href: '/inventory', icon: Boxes },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
];

export const Sidebar = () => {
  const location = useLocation();

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
    <div className="bg-black text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold">MKSimplo</h2>
      </div>
      
      <nav className="flex-1 mt-6">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
};
