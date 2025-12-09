import React, { useState } from 'react';
import { ArrowRight, Calendar, User, ArrowLeft, Clock, Share2, FileText } from 'lucide-react';

interface BlogPageProps {
  onOpenModal: () => void;
}

const posts = [
  {
    id: 1,
    title: "INSS negou seu benefício? Saiba os 3 passos para reverter agora",
    category: "Recursos",
    readTime: "4 min de leitura",
    date: "08 Dez, 2024",
    excerpt: "Receber uma carta de indeferimento não é o fim. Descubra como a via judicial pode ser muito mais rápida do que você imagina e garantir seus atrasados.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed text-slate-700">
          Receber uma carta de indeferimento do INSS é como um banho de água fria. Você contribuiu por anos ou precisa desesperadamente do auxílio por uma questão de saúde, e a resposta do governo é um sonoro "NÃO".
        </p>
        <p className="mb-8 text-lg leading-relaxed text-slate-700">
          A sensação de injustiça é enorme, mas aqui vai a primeira boa notícia: <strong>a negativa administrativa é apenas o começo da batalha, não o fim.</strong> Mais de 60% das decisões do INSS são revertidas na justiça. Veja como proceder:
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 border-l-4 border-amber-500 pl-4">1. Entenda o Motivo da Negativa</h2>
        <p className="mb-6 leading-relaxed text-slate-700">
          O primeiro passo é analisar friamente a Carta de Indeferimento. O INSS não nega "porque quer", ele alega um motivo técnico, que muitas vezes está errado. Os mais comuns são:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700">
          <li><strong>Falta de Carência:</strong> Alegam que você não pagou o número mínimo de meses.</li>
          <li><strong>Perda da Qualidade de Segurado:</strong> Dizem que você parou de pagar há muito tempo.</li>
          <li><strong>Não constatação de Incapacidade:</strong> O perito médico diz que você pode trabalhar, mesmo estando doente.</li>
          <li><strong>Falta de Documentação:</strong> O servidor não encontrou algum papel que muitas vezes já estava lá.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 border-l-4 border-amber-500 pl-4">2. Recurso Administrativo vs. Justiça Federal</h2>
        <p className="mb-6 leading-relaxed text-slate-700">
          Muitas pessoas tentam recorrer no próprio INSS (Junta de Recursos). O problema? É o próprio sistema julgando o sistema. Estatisticamente, as chances de reversão são baixas e o processo pode levar anos parado em uma pilha de papéis.
        </p>
        <p className="mb-6 leading-relaxed text-slate-700">
          Na <strong>Justiça Federal</strong>, o jogo muda. Seu caso será analisado por um Juiz imparcial. Se for benefício por doença, você passará por um médico perito de confiança do juiz (e não do INSS). Além disso, na justiça você garante o recebimento dos <strong>atrasados</strong> desde a data do primeiro pedido negado, com juros e correção monetária.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 border-l-4 border-amber-500 pl-4">3. A Importância do Especialista</h2>
        <p className="mb-6 leading-relaxed text-slate-700">
          O Direito Previdenciário é cheio de detalhes. Um documento errado ou um prazo perdido pode trancar seu direito para sempre (o que chamamos de "coisa julgada").
        </p>
        <p className="mb-6 leading-relaxed text-slate-700">
          Advogados generalistas muitas vezes não conhecem as teses específicas que salvam benefícios. Ter um escritório especialista, que sabe exatamente quais provas juntar (laudos, PPP, carteiras antigas) e como argumentar, aumenta exponencialmente suas chances de êxito.
        </p>
      </>
    )
  },
  {
    id: 2,
    title: "Revisão da Vida Toda: O STF decidiu, e agora?",
    category: "Notícias",
    readTime: "3 min de leitura",
    date: "05 Dez, 2024",
    excerpt: "Entenda o impacto da decisão do Supremo Tribunal Federal na sua aposentadoria e veja se você se enquadra no grupo que pode ter o benefício dobrado.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed text-slate-700">
          O tema "Revisão da Vida Toda" tomou conta dos noticiários jurídicos nos últimos anos e gerou muita ansiedade em aposentados. Trata-se da possibilidade de incluir no cálculo da sua aposentadoria todas as contribuições feitas ao longo da sua vida, inclusive as anteriores a julho de 1994.
        </p>
        <p className="mb-6 leading-relaxed text-slate-700">
          Em 1999, o governo mudou a regra de cálculo e decidiu ignorar os salários de contribuição anteriores a Julho de 1994. Isso prejudicou quem ganhava bem no início da carreira. A tese da Revisão da Vida Toda busca aplicar a regra mais vantajosa para o segurado.
        </p>
      </>
    )
  },
  {
    id: 3,
    title: "BPC/LOAS: Quem tem direito e como comprovar a baixa renda",
    category: "Assistencial",
    readTime: "5 min de leitura",
    date: "01 Dez, 2024",
    excerpt: "Muitos brasileiros perdem esse benefício por erros no Cadastro Único. Aprenda a blindar seu pedido contra negativas do INSS.",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed text-slate-700">
          O Benefício de Prestação Continuada (BPC), previsto na Lei Orgânica da Assistência Social (LOAS), é a rede de proteção mais importante do Brasil. Ele garante um salário mínimo mensal para idosos com 65 anos ou mais e pessoas com deficiência de qualquer idade, mesmo que nunca tenham contribuído para o INSS.
        </p>
      </>
    )
  },
  {
    id: 4,
    title: "Auxílio-Doença x Aposentadoria por Invalidez: Qual a diferença?",
    category: "Incapacidade",
    readTime: "3 min de leitura",
    date: "28 Nov, 2024",
    excerpt: "Saber a distinção entre incapacidade temporária e permanente é crucial para pedir o benefício correto e evitar dores de cabeça.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    content: (
      <>
        <p className="mb-6 text-lg leading-relaxed text-slate-700">
          Muitos segurados confundem os benefícios por incapacidade e acabam aceitando decisões do INSS que os prejudicam financeiramente. Entender a diferença técnica é crucial.
        </p>
      </>
    )
  }
];

export const BlogPage: React.FC<BlogPageProps> = ({ onOpenModal }) => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const activePost = posts.find(p => p.id === selectedPostId);

  const handleOpenPost = (id: number) => {
    setSelectedPostId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedPostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activePost) {
    return (
      <div className="pt-24 pb-20 bg-white min-h-screen">
        <article className="container mx-auto px-4 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={handleBack}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors font-medium group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para o Blog
          </button>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold uppercase text-xs tracking-wide">{activePost.category}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {activePost.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {activePost.readTime}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
              {activePost.title}
            </h1>

            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-10">
              <img 
                src={activePost.image} 
                alt={activePost.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          <div className="prose prose-lg prose-slate max-w-none text-slate-700 mb-16">
            {activePost.content}
          </div>

          <div className="border-t border-b border-slate-200 py-8 mb-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-900">Compartilhar:</span>
              <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-slate-600"><Share2 size={18}/></button>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <User size={16} /> Escrito por Equipe HelpPrev
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Precisa de ajuda com esse tema?</h3>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                Cada caso é único. Fale agora com um de nossos advogados especialistas e tire suas dúvidas sem compromisso.
              </p>
              <button 
                onClick={onOpenModal}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-8 rounded-full transition-all transform hover:-translate-y-1 shadow-lg"
              >
                Analisar Meu Caso Gratuitamente
              </button>
            </div>
          </div>

        </article>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:border-amber-200 transition-all group flex flex-col md:flex-row h-full md:h-72 cursor-pointer" onClick={() => handleOpenPost(post.id)}>
              <div className="md:w-2/5 h-48 md:h-full overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6 md:w-3/5 flex flex-col justify-between relative">
                <div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded font-bold uppercase tracking-wide border border-amber-100">{post.category}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div 
                  className="mt-auto text-amber-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  Ler artigo completo <ArrowRight size={16} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 mt-20">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
             <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500 rounded-full blur-3xl"></div>
             <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Tem dúvidas sobre o seu caso específico?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
              Artigos ajudam, mas nada substitui a análise de um especialista sobre a sua documentação. Não arrisque perder prazos.
            </p>
            <button 
              onClick={onOpenModal}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 px-10 rounded-lg transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2 mx-auto"
            >
              <FileText size={20} />
              Quero uma Análise Gratuita
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
