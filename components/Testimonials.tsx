import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Maria de Lourdes",
      role: "Aposentada por Invalidez",
      text: "O INSS negou meu pedido 3 vezes. Eu já tinha desistido. Encontrei o MeuPrev e em 2 meses eles reverteram a situação. Recebi todos os atrasados!",
      image: "https://i.postimg.cc/L8s5WdcL/434169537-7640047612712221-4074087201507959090-n.jpg"
    },
    {
      name: "João Silva",
      role: "Aposentadoria Especial",
      text: "Equipe fantástica. Me atenderam super rápido pelo WhatsApp, tiraram todas as dúvidas e conseguiram minha aposentadoria especial que eu nem sabia que tinha direito.",
      image: "https://i.postimg.cc/8zCcY824/464940954-8598270866931744-404034374802692466-n.jpg"
    },
    {
      name: "Ana Paula",
      role: "Pensão por Morte",
      text: "Quando meu marido faleceu, o INSS negou a pensão dizendo que ele não era segurado. Graças à advogada indicada pelo site, provamos o direito na justiça e garanti o futuro dos meus filhos.",
      image: "https://i.postimg.cc/4x3y0CDB/452916944-7956736357726421-2104946427979049056-n.jpg"
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