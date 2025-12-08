import React from 'react';
import { ContactForm } from './ContactForm';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
        
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Não perca mais tempo. <br/>
            <span className="text-amber-500">Recupere seu benefício.</span>
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            Cada dia que passa é dinheiro a menos no seu bolso. Nossa equipe especializada já ajudou mais de 5.000 pessoas a reverterem negativas do INSS. Deixe seus dados que nós ligamos para você.
          </p>
          
          <div className="hidden md:flex flex-col gap-4 border-l-4 border-amber-500 pl-6">
            <div>
              <strong className="text-white block text-lg">Sem Custo Inicial</strong>
              <span className="text-slate-400 text-sm">Análise do caso é 100% gratuita.</span>
            </div>
            <div>
              <strong className="text-white block text-lg">Atendimento Ágil</strong>
              <span className="text-slate-400 text-sm">Resposta em até 24 horas úteis.</span>
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