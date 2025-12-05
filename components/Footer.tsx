import React from 'react';
import { Scale, Instagram, Facebook, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-amber-500 p-1.5 rounded-lg">
                <Scale className="text-slate-900 w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">
                Help<span className="text-amber-500">Prev</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Escritório de advocacia digital especializado em direito previdenciário. Lutamos incansavelmente pelos direitos dos segurados do INSS.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-500">Aposentadorias</a></li>
              <li><a href="#" className="hover:text-amber-500">Auxílio Doença</a></li>
              <li><a href="#" className="hover:text-amber-500">BPC / LOAS</a></li>
              <li><a href="#" className="hover:text-amber-500">Revisão da Vida Toda</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-500">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-amber-500">Nossa Equipe</a></li>
              <li><a href="#" className="hover:text-amber-500">Blog Jurídico</a></li>
              <li><a href="#" className="hover:text-amber-500">Política de Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>WhatsApp: (11) 99999-9999</li>
              <li>Email: contato@helpprev.com.br</li>
              <li>Atendimento: Seg a Sex, 8h às 18h</li>
              <li className="mt-4 text-xs text-slate-500">OAB/SP 00.000</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} HelpPrev Advocacia Previdenciária. Todos os direitos reservados.</p>
          <p className="mt-2 text-xs">Este site não possui vínculo com o Instituto Nacional do Seguro Social (INSS).</p>
        </div>
      </div>
    </footer>
  );
};