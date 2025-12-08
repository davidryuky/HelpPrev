import React from 'react';
import { Target, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AboutProps {
  onOpenModal: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenModal }) => {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Hero Interno */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center max-w-4xl mx-auto">
          <span className="text-amber-500 font-bold tracking-wider uppercase text-sm">Nossa História</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3 mb-6">
            Mais do que advogados, somos <span className="text-amber-600">guardiões do seu futuro.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Fundada com a missão de democratizar o acesso à justiça previdenciária, a HelpPrev nasceu da indignação contra a burocracia que impede trabalhadores honestos de receberem o que é seu por direito.
          </p>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="bg-white py-16 mb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute top-0 left-0 w-20 h-20 bg-amber-500 rounded-tl-3xl opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Reunião de Advogados" 
                className="rounded-2xl shadow-xl z-10 relative"
              />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-900 rounded-br-3xl -z-0 translate-x-4 translate-y-4"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Lutamos contra a injustiça do sistema</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg h-fit">
                    <Target className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Missão</h3>
                    <p className="text-slate-600">Garantir a subsistência e a dignidade de cada cliente, revertendo negativas abusivas com técnica jurídica de ponta.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg h-fit">
                    <Users className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Visão</h3>
                    <p className="text-slate-600">Ser o maior e mais eficiente escritório digital de direito previdenciário do Brasil, reconhecido pela humanização.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg h-fit">
                    <ShieldCheck className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Valores</h3>
                    <p className="text-slate-600">Transparência absoluta, agilidade processual e empatia com a dor do segurado.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-slate-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-12">Nossos números não mentem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-black text-amber-500 mb-2">99%</div>
              <div className="text-lg text-slate-300">Taxa de Sucesso</div>
            </div>
            <div>
              <div className="text-5xl font-black text-amber-500 mb-2">R$ 15M+</div>
              <div className="text-lg text-slate-300">Recuperados em Atrasados</div>
            </div>
            <div>
              <div className="text-5xl font-black text-amber-500 mb-2">24h</div>
              <div className="text-lg text-slate-300">Tempo Médio de Análise</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Quer fazer parte dessa estatística de sucesso?</h2>
        <p className="text-slate-600 mb-8">Nossa equipe está pronta para lutar pelo seu caso hoje mesmo.</p>
        <button 
          onClick={onOpenModal}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-10 rounded-full transition-all transform hover:-translate-y-1 shadow-lg text-lg"
        >
          Falar com um Advogado Agora
        </button>
      </section>
    </div>
  );
};