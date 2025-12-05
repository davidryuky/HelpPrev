import React, { useState, useEffect } from 'react';
import { Scale, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900 shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="bg-amber-500 p-1.5 rounded-lg">
            <Scale className="text-slate-900 w-6 h-6" />
          </div>
          <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-white' : 'text-white'}`}>
            Help<span className="text-amber-500">Prev</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('servicos')} className="text-slate-200 hover:text-white font-medium transition-colors">Serviços</button>
          <button onClick={() => scrollTo('diferenciais')} className="text-slate-200 hover:text-white font-medium transition-colors">Diferenciais</button>
          <button onClick={() => scrollTo('depoimentos')} className="text-slate-200 hover:text-white font-medium transition-colors">Casos de Sucesso</button>
          <button 
            onClick={() => window.open('https://wa.me/5511999999999?text=Ol%C3%A1%2C%20meu%20benef%C3%ADcio%20foi%20negado%20e%20preciso%20de%20ajuda.', '_blank')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
          >
            Falar com Especialista
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-900 shadow-xl border-t border-slate-800 p-6 flex flex-col gap-4 md:hidden">
          <button onClick={() => scrollTo('servicos')} className="text-left text-slate-200 py-2 border-b border-slate-800">Serviços</button>
          <button onClick={() => scrollTo('diferenciais')} className="text-left text-slate-200 py-2 border-b border-slate-800">Diferenciais</button>
          <button onClick={() => scrollTo('depoimentos')} className="text-left text-slate-200 py-2 border-b border-slate-800">Depoimentos</button>
          <button 
             onClick={() => window.open('https://wa.me/5511999999999?text=Ol%C3%A1%2C%20meu%20benef%C3%ADcio%20foi%20negado%20e%20preciso%20de%20ajuda.', '_blank')}
            className="bg-amber-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-center mt-2"
          >
            Falar no WhatsApp Agora
          </button>
        </div>
      )}
    </header>
  );
};