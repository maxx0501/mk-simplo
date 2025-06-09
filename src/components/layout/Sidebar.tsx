
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Store, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  UserCheck,
  Settings, 
  CreditCard,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Vendas', href: '/sales', icon: ShoppingCart },
  { name: 'Vendedores', href: '/employees', icon: UserCheck },
  { name: 'Estoque', href: '/inventory', icon: Store },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Assinaturas', href: '/subscription', icon: CreditCard },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-blue-600">
        <Store className="h-8 w-8 text-white" />
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
                'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
