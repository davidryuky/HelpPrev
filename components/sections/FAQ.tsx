import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "Preciso pagar algo antecipado?",
      a: "Não! Na maioria dos casos, trabalhamos com contrato de risco (ad exitum). Você só paga uma porcentagem quando receber seu benefício. A análise inicial é 100% gratuita."
    },
    {
      q: "O atendimento é apenas online?",
      a: "Atendemos o Brasil inteiro de forma 100% digital. Isso garante agilidade no seu processo. Você não precisa sair de casa, gastar com transporte ou enfrentar filas. Tudo é feito pelo WhatsApp."
    },
    {
      q: "Quanto tempo demora para sair o resultado?",
      a: "Isso depende de cada caso e do tipo de benefício. No entanto, nossa equipe é reconhecida pela rapidez em protocolar os recursos, o que acelera significativamente o processo comparado a advogados generalistas."
    },
    {
      q: "Meu benefício foi negado há muito tempo. Ainda tem jeito?",
      a: "Geralmente sim! Existem prazos legais, mas muitas vezes conseguimos reverter decisões antigas se houver erro do INSS. Entre em contato para analisarmos."
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Perguntas Frequentes</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
      >
        {question}
        {isOpen ? <ChevronUp className="text-amber-500" /> : <ChevronDown className="text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-5 pt-0 text-slate-600 border-t border-slate-100 mt-2">
          {answer}
        </div>
      )}
    </div>
  );
}
