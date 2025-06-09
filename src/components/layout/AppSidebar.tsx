
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Store, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Archive,
  TrendingUp,
  Crown,
  Settings
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navigationItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Produtos', url: '/products', icon: Package },
  { title: 'Vendas', url: '/sales', icon: ShoppingCart },
  { title: 'Vendedores', url: '/users', icon: Users },
  { title: 'Estoque', url: '/inventory', icon: Archive },
  { title: 'Relatórios', url: '/reports', icon: TrendingUp },
  { title: 'Assinaturas', url: '/subscription', icon: Crown },
  { title: 'Configurações', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-black border-r border-gray-800">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <Store className="h-8 w-8 text-golden" />
          <span className="text-xl font-bold text-white">MKsimplo</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-sm font-medium uppercase tracking-wider px-3">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-golden hover:text-black group',
                          isActive && 'bg-golden text-black font-semibold'
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-base">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
