import React, { useState, useEffect } from 'react';
import { Scale, Menu, X, Users } from 'lucide-react';
import { PageView } from '../App';

interface HeaderProps {
  onOpenModal: () => void;
  onNavigate: (view: PageView) => void;
  currentView: PageView;
}

export const Header: React.FC<HeaderProps> = ({ onOpenModal, onNavigate, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    onNavigate('home');
  };

  const handleSectionClick = (id: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      // Aguarda um pouco para renderizar a home antes de scrollar
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleOpenModal = () => {
    onOpenModal();
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || currentView !== 'home' ? 'bg-slate-900 shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <div className="bg-amber-500 p-1.5 rounded-lg">
            <Users className="text-slate-900 w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Meu<span className="text-amber-500">Prev</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavigate('home')} className={`font-medium transition-colors ${currentView === 'home' ? 'text-amber-500' : 'text-slate-200 hover:text-white'}`}>Início</button>
          <button onClick={() => onNavigate('about')} className={`font-medium transition-colors ${currentView === 'about' ? 'text-amber-500' : 'text-slate-200 hover:text-white'}`}>Quem Somos</button>
          <button onClick={() => handleSectionClick('servicos')} className="text-slate-200 hover:text-white font-medium transition-colors">Serviços</button>
          <button onClick={() => onNavigate('blog')} className={`font-medium transition-colors ${currentView === 'blog' ? 'text-amber-500' : 'text-slate-200 hover:text-white'}`}>Blog</button>
          <button 
            onClick={handleOpenModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105 shadow-md"
          >
            Achar meu Advogado
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
          <button onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }} className="text-left text-slate-200 py-2 border-b border-slate-800">Início</button>
          <button onClick={() => { onNavigate('about'); setIsMobileMenuOpen(false); }} className="text-left text-slate-200 py-2 border-b border-slate-800">Quem Somos</button>
          <button onClick={() => handleSectionClick('servicos')} className="text-left text-slate-200 py-2 border-b border-slate-800">Serviços</button>
          <button onClick={() => { onNavigate('blog'); setIsMobileMenuOpen(false); }} className="text-left text-slate-200 py-2 border-b border-slate-800">Blog</button>
          <button 
             onClick={handleOpenModal}
            className="bg-amber-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-center mt-2"
          >
            Achar meu Advogado
          </button>
        </div>
      )}
    </header>
  );
};