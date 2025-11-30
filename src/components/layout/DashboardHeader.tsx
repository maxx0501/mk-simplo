
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Menu } from 'lucide-react';

export const DashboardHeader = () => {
  const user = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4 md:ml-0">
            <h2 className="text-lg font-semibold text-gray-900">
              {user.store_name || 'Loja Exemplo'}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Plano Gratuito
          </Badge>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
        </div>
      </div>
    </header>
  );
};
