import React from 'react';
import { FileWarning, Briefcase, Baby, UserPlus, HeartPulse, ShieldAlert, Calculator, PlusCircle } from 'lucide-react';

interface ServicesProps {
  onOpenModal: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenModal }) => {
  const services = [
    {
      icon: <FileWarning />,
      title: "Benefício Negado",
      desc: "O INSS disse 'não'? Conectamos você a um advogado que sabe reverter essa decisão."
    },
    {
      icon: <Briefcase />,
      title: "Aposentadoria",
      desc: "Especialistas em calcular o melhor valor para quem trabalhou a vida toda."
    },
    {
      icon: <HeartPulse />,
      title: "Auxílio Doença",
      desc: "Se você está doente e não pode trabalhar, achamos quem lute pelo seu auxílio."
    },
    {
      icon: <UserPlus />,
      title: "BPC / LOAS",
      desc: "Para idosos e pessoas com deficiência de baixa renda que precisam de ajuda."
    },
    {
      icon: <Baby />,
      title: "Salário Maternidade",
      desc: "Advogados que garantem o dinheiro das mães, mesmo que estejam desempregadas."
    },
    {
      icon: <ShieldAlert />,
      title: "Pensão por Morte",
      desc: "Agilidade para conseguir a pensão para a família em momentos difíceis."
    },
    {
      icon: <Calculator />,
      title: "Revisão de Valor",
      desc: "Recebe menos do que deveria? Analisamos se o cálculo do INSS foi feito corretamente."
    },
    {
      icon: <PlusCircle />,
      title: "Todos os Outros",
      desc: "Problemas com tempo de contribuição, certidões ou qualquer outra demanda do INSS."
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-bold tracking-wider uppercase text-sm">Nossa Rede Atende</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Qual especialista você procura?</h2>
          
          <div className="max-w-3xl mx-auto bg-slate-800/50 border border-slate-700 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-slate-300 text-base leading-relaxed">
              Usar o MeuPrev é <strong className="text-amber-400">100% gratuito</strong>. 
              Você conta sua história, um especialista analisa e te apresenta uma solução sem custo inicial.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:bg-slate-800 transition-all hover:-translate-y-1 flex flex-col">
              <div className="text-amber-500 mb-4 w-10 h-10 flex items-center justify-center bg-slate-700 rounded-lg">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm flex-grow">{item.desc}</p>
              <button 
                 onClick={onOpenModal}
                className="mt-4 text-amber-500 font-semibold text-xs hover:text-amber-400 flex items-center gap-1 group uppercase tracking-wide"
              >
                Achar especialista 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};