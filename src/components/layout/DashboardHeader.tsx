
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationDropdown } from '../NotificationDropdown';

export const DashboardHeader = () => {
  const user = JSON.parse(localStorage.getItem('mksimplo_user') || '{}');
  const navigate = useNavigate();

  const handlePlanClick = () => {
    navigate('/subscription');
  };

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
          <Badge 
            variant="outline" 
            className="text-blue-600 border-blue-600 cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={handlePlanClick}
          >
            Plano Gratuito
          </Badge>
          
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
};
