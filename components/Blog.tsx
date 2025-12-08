import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';

interface BlogProps {
  onOpenModal: () => void;
}

const posts = [
  {
    title: "INSS negou seu benefício? Saiba os 3 passos para reverter agora",
    category: "Recursos",
    date: "08 Dez, 2024",
    excerpt: "Receber uma carta de indeferimento não é o fim. Descubra como a via judicial pode ser muito mais rápida do que você imagina e garantir seus atrasados.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Revisão da Vida Toda: O STF decidiu, e agora?",
    category: "Notícias",
    date: "05 Dez, 2024",
    excerpt: "Entenda o impacto da decisão do Supremo Tribunal Federal na sua aposentadoria e veja se você se enquadra no grupo que pode ter o benefício dobrado.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "BPC/LOAS: Quem tem direito e como comprovar a baixa renda",
    category: "Assistencial",
    date: "01 Dez, 2024",
    excerpt: "Muitos brasileiros perdem esse benefício por erros no Cadastro Único. Aprenda a blindar seu pedido contra negativas do INSS.",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Auxílio-Doença x Aposentadoria por Invalidez: Qual a diferença?",
    category: "Incapacidade",
    date: "28 Nov, 2024",
    excerpt: "Saber a distinção entre incapacidade temporária e permanente é crucial para pedir o benefício correto e evitar dores de cabeça.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

export const Blog: React.FC<BlogProps> = ({ onOpenModal }) => {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <section className="container mx-auto px-4 mb-16 text-center">
        <span className="text-amber-500 font-bold tracking-wider uppercase text-sm">Blog Jurídico</span>
        <h1 className="text-4xl font-extrabold text-slate-900 mt-3 mb-6">Informação é poder</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Mantenha-se atualizado sobre seus direitos previdenciários. Nossa equipe traduz o "juridiquês" para que você entenda exatamente o que fazer.
        </p>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {posts.map((post, idx) => (
            <article key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all group flex flex-col md:flex-row h-full md:h-64">
              <div className="md:w-2/5 h-48 md:h-full overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">{post.category}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <button 
                  onClick={onOpenModal}
                  className="mt-4 text-amber-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all self-start"
                >
                  Ler artigo completo <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="container mx-auto px-4 mt-16">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Tem dúvidas sobre o seu caso específico?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Artigos ajudam, mas nada substitui a análise de um especialista sobre a sua documentação. Não arrisque perder prazos.
          </p>
          <button 
            onClick={onOpenModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-10 rounded-lg transition-all transform hover:-translate-y-1"
          >
            Quero uma Análise Gratuita
          </button>
        </div>
      </section>
    </div>
  );
};