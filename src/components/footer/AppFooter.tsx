
import React from 'react';
import { Store } from 'lucide-react';

export const AppFooter = () => {
  const footerLinks = [
    { name: 'Sobre', href: '#' },
    { name: 'Contato', href: '#' },
    { name: 'Termos de Uso', href: '#' },
    { name: 'Política de Privacidade', href: '#' }
  ];

  return (
    <footer className="bg-dark-blue text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <Store className="h-8 w-8 text-golden" />
            <div>
              <h3 className="text-xl font-bold">MKsimplo</h3>
              <p className="text-gray-300">Sistema de Estoque Inteligente</p>
            </div>
          </div>
          
          <nav className="flex flex-wrap justify-center lg:justify-end space-x-8">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-golden transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 MKsimplo. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
