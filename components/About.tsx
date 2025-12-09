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
          <span className="text-amber-500 font-bold tracking-wider uppercase text-sm">Quem Somos</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3 mb-6">
            Não somos um escritório.<br /> Somos a ponte até a <span className="text-amber-600">sua justiça.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            O MeuPrev nasceu para ajudar quem não sabe onde encontrar um bom advogado. Criamos uma rede com os melhores profissionais do país para atender você, onde quer que você more.
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
                alt="Conexão de Pessoas" 
                className="rounded-2xl shadow-xl z-10 relative"
              />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-900 rounded-br-3xl -z-0 translate-x-4 translate-y-4"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Facilitamos sua vida</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg h-fit">
                    <Target className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Missão</h3>
                    <p className="text-slate-600">Garantir que qualquer pessoa, em qualquer lugar do Brasil, consiga falar com um advogado especialista sem sair de casa.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg h-fit">
                    <Users className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Como funciona</h3>
                    <p className="text-slate-600">Você preenche nosso formulário e nós avisamos nossa rede de advogados. O especialista ideal para o seu caso entra em contato com você.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg h-fit">
                    <ShieldCheck className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Qualidade</h3>
                    <p className="text-slate-600">Selecionamos a dedo nossos parceiros. Só indicamos advogados com experiência e boa reputação.</p>
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
          <h2 className="text-3xl font-bold mb-12">Nossa Rede em Números</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-black text-amber-500 mb-2">50+</div>
              <div className="text-lg text-slate-300">Advogados Parceiros</div>
            </div>
            <div>
              <div className="text-5xl font-black text-amber-500 mb-2">26</div>
              <div className="text-lg text-slate-300">Estados Atendidos</div>
            </div>
            <div>
              <div className="text-5xl font-black text-amber-500 mb-2">24h</div>
              <div className="text-lg text-slate-300">Para o 1º Contato</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Precisa de ajuda com o INSS?</h2>
        <p className="text-slate-600 mb-8">Deixe que a gente encontra o profissional certo para você.</p>
        <button 
          onClick={onOpenModal}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-10 rounded-full transition-all transform hover:-translate-y-1 shadow-lg text-lg"
        >
          Quero ser atendido
        </button>
      </section>
    </div>
  );
};