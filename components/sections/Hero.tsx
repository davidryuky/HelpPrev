import React from 'react';
import { ArrowRight, SearchCheck } from 'lucide-react';

interface HeroProps {
  onOpenModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Advocacia" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <SearchCheck size={16} className="text-amber-500" />
            <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Conectamos você à justiça</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            O INSS disse NÃO? <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Nós encontramos quem consegue o SIM.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Não aceite perder seus direitos. Conectamos você aos advogados que mais aprovam benefícios no Brasil. É rápido, sem sair de casa e você não paga nada para começar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
               onClick={onOpenModal}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-900 text-lg font-bold py-4 px-8 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Encontrar meu Advogado
              <ArrowRight size={20} />
            </button>
            <span className="text-slate-400 text-sm mt-2 sm:mt-0">
              *Mais de 5.000 pessoas já conseguiram ajuda
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
