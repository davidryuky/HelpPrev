import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Maria de Lourdes",
      role: "Aposentada por Invalidez",
      text: "O INSS negou meu pedido 3 vezes. Eu já tinha desistido. Encontrei a HelpPrev e em 2 meses eles reverteram a situação. Recebi todos os atrasados!",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "João Silva",
      role: "Aposentadoria Especial",
      text: "Equipe fantástica. Me atenderam super rápido pelo WhatsApp, tiraram todas as dúvidas e conseguiram minha aposentadoria especial que eu nem sabia que tinha direito.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Ana Paula",
      role: "Salário Maternidade",
      text: "Eu estava desempregada quando meu filho nasceu e achei que não tinha direito. Eles analisaram, viram que eu estava no período de graça e conseguiram meu benefício.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section id="depoimentos" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Histórias Reais de Sucesso</h2>
          <p className="text-slate-600">Junte-se a mais de 5.000 clientes satisfeitos em todo o Brasil.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-2xl relative">
              <div className="flex gap-1 mb-4 text-amber-500">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-700 mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <span className="text-xs text-slate-500 uppercase font-semibold">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};