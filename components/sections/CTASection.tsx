import React from 'react';
import { ContactForm } from '../common/ContactForm';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
        
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Pare de procurar. <br/>
            <span className="text-amber-500">Nós achamos para você.</span>
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            Não gaste tempo e sola de sapato procurando escritórios. Temos uma lista com os melhores advogados do Brasil prontos para atender seu caso.
          </p>
          
          <div className="hidden md:flex flex-col gap-4 border-l-4 border-amber-500 pl-6">
            <div>
              <strong className="text-white block text-lg">Sem Custo para Usar</strong>
              <span className="text-slate-400 text-sm">Nossa plataforma é gratuita para quem procura ajuda.</span>
            </div>
            <div>
              <strong className="text-white block text-lg">Atendimento Rápido</strong>
              <span className="text-slate-400 text-sm">Um especialista entrará em contato pelo WhatsApp para te ouvir com atenção.</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 w-full">
          <ContactForm />
        </div>

      </div>
    </section>
  );
};
