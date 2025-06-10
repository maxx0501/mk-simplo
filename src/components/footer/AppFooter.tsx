
import React from 'react';
import { Store, Heart, ArrowUp } from 'lucide-react';

export const AppFooter = () => {
  const footerLinks = [
    { name: 'Sobre Nós', href: '#' },
    { name: 'Contato', href: '#' },
    { name: 'Termos de Uso', href: '#' },
    { name: 'Política de Privacidade', href: '#' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  MKsimplo
                </h3>
                <p className="text-gray-400">Sistema de Estoque Inteligente</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Transformamos a gestão de estoque em uma experiência simples, inteligente e eficiente. 
              Mais de <span className="text-yellow-400 font-semibold">10.000 empresas</span> já confiam em nós.
            </p>

            <div className="flex items-center gap-2 text-yellow-400">
              <span className="text-sm">Feito com</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-sm">para empreendedores brasileiros</span>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Links Úteis</h4>
            <nav className="flex flex-col space-y-3">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-base hover:translate-x-1 transform transition-transform"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Contato</h4>
            <div className="space-y-3 text-gray-400">
              <p className="flex items-center gap-2">
                📧 <span>contato@mksimplo.com</span>
              </p>
              <p className="flex items-center gap-2">
                📱 <span>(11) 99999-9999</span>
              </p>
              <p className="flex items-center gap-2">
                🕒 <span>Seg-Sex: 8h às 18h</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-center md:text-left">
              <p>© 2024 MKsimplo. Todos os direitos reservados.</p>
              <p className="text-sm mt-1">
                CNPJ: 00.000.000/0001-00 • Versão 2.1.0
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                📘 Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                📸 Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                💼 LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      </div>
    </footer>
  );
};
