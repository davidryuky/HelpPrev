import React from 'react';
import { FileWarning, Briefcase, Baby, UserPlus, HeartPulse, ShieldAlert } from 'lucide-react';

export const Services: React.FC = () => {
  const services = [
    {
      icon: <FileWarning />,
      title: "Benefício Negado",
      desc: "Analisamos o motivo do indeferimento e entramos com recurso administrativo ou judicial imediatamente."
    },
    {
      icon: <Briefcase />,
      title: "Aposentadoria",
      desc: "Por tempo de contribuição, idade ou especial. Calculamos o melhor valor possível para você."
    },
    {
      icon: <HeartPulse />,
      title: "Auxílio Doença",
      desc: "Se você está incapacitado de trabalhar e o perito negou, nós conseguimos reverter na justiça."
    },
    {
      icon: <UserPlus />,
      title: "BPC / LOAS",
      desc: "Benefício para idosos ou pessoas com deficiência de baixa renda, mesmo sem nunca ter contribuído."
    },
    {
      icon: <Baby />,
      title: "Salário Maternidade",
      desc: "Garantimos o direito das mães, inclusive desempregadas, de receberem o auxílio maternidade."
    },
    {
      icon: <ShieldAlert />,
      title: "Pensão por Morte",
      desc: "Agilizamos a concessão da pensão para dependentes, resolvendo pendências de documentação."
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-500 font-bold tracking-wider uppercase text-sm">Áreas de Atuação</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Como podemos te ajudar hoje?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-all hover:-translate-y-1">
              <div className="text-amber-500 mb-4 w-12 h-12 flex items-center justify-center bg-slate-700 rounded-lg">
                {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
              <button 
                 onClick={() => window.open(`https://wa.me/5511999999999?text=Quero%20saber%20mais%20sobre%20${encodeURIComponent(item.title)}`, '_blank')}
                className="mt-6 text-amber-500 font-semibold text-sm hover:text-amber-400 flex items-center gap-1 group"
              >
                Resolver esse problema 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};