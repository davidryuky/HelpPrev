import React from 'react';
import { MessageCircle } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black opacity-10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Não deixe seu dinheiro nas mãos do governo.
        </h2>
        <p className="text-xl text-slate-900/80 mb-10 max-w-2xl mx-auto font-medium">
          O tempo está passando e você está perdendo valores atrasados. Nossa equipe está online agora esperando seu contato para iniciar o resgate.
        </p>
        
        <button 
           onClick={() => window.open('https://wa.me/5511999999999?text=Preciso%20de%20ajuda%20urgente%20com%20meu%20INSS', '_blank')}
          className="bg-slate-900 text-white text-xl font-bold py-5 px-10 rounded-full shadow-2xl hover:bg-slate-800 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
        >
          <MessageCircle size={24} />
          Falar com Advogado no WhatsApp
        </button>
      </div>
    </section>
  );
};