import React from 'react';
import { Users, Instagram, Facebook, Linkedin } from 'lucide-react';
import { PageView } from '../../types';

interface FooterProps {
  onNavigate?: (view: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (view: PageView) => {
    if (onNavigate) onNavigate(view);
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => handleNav('home')}>
              <div className="bg-amber-500 p-1.5 rounded-lg">
                <Users className="text-slate-900 w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">
                Meu<span className="text-amber-500">Prev</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Plataforma digital que conecta você aos melhores advogados previdenciários do Brasil. Simples, rápido e acessível.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Especialidades</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleNav('home')} className="hover:text-amber-500 text-left">Aposentadorias</button></li>
              <li><button onClick={() => handleNav('home')} className="hover:text-amber-500 text-left">Auxílio Doença</button></li>
              <li><button onClick={() => handleNav('home')} className="hover:text-amber-500 text-left">BPC / LOAS</button></li>
              <li><button onClick={() => handleNav('home')} className="hover:text-amber-500 text-left">Salário Maternidade</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleNav('about')} className="hover:text-amber-500 text-left">Quem Somos</button></li>
              <li><button onClick={() => handleNav('blog')} className="hover:text-amber-500 text-left">Blog Jurídico</button></li>
              <li><button onClick={() => handleNav('privacy')} className="hover:text-amber-500 text-left">Política de Privacidade</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Fale Conosco</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: contato@meuprev.com</li>
              <li>Atendimento da Plataforma: <br/>24 horas por dia</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p className="font-medium text-slate-300">&copy; {new Date().getFullYear()} MeuPrev Plataforma de Conexão. Todos os direitos reservados.</p>
          <p className="mt-2 text-xs text-slate-500">O MeuPrev não é um escritório de advocacia, mas uma plataforma que facilita o contato entre cidadãos e advogados especializados.</p>
        </div>
      </div>
    </footer>
  );
};