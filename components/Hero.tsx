import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Advocacia" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck size={16} className="text-amber-500" />
            <span className="text-amber-500 text-sm font-semibold tracking-wide uppercase">Especialistas em INSS</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Benefício Negado? <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Nós Revertemos a Injustiça.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Não aceite o "não" do INSS. Nossa equipe de elite recupera sua aposentadoria ou auxílio com rapidez e estratégia. 
            Analisamos seu caso hoje mesmo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
               onClick={() => window.open('https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20analisar%20meu%20caso%20agora.', '_blank')}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-900 text-lg font-bold py-4 px-8 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Analisar Meu Caso Agora
              <ArrowRight size={20} />
            </button>
            <span className="text-slate-400 text-sm mt-2 sm:mt-0">
              *Atendimento imediato via WhatsApp
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};