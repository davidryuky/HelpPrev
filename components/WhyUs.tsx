import React from 'react';
import { Clock, Gavel, Award, HeartHandshake } from 'lucide-react';

export const WhyUs: React.FC = () => {
  return (
    <section id="diferenciais" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Por que escolher a HelpPrev?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Não somos apenas advogados. Somos uma força tarefa dedicada a garantir que você receba cada centavo que é seu por direito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Clock className="w-10 h-10 text-amber-500" />}
            title="Rapidez Extrema"
            description="Sabemos que você precisa do dinheiro agora. Utilizamos tecnologia própria para acelerar protocolos e recursos."
          />
          <FeatureCard 
            icon={<Gavel className="w-10 h-10 text-amber-500" />}
            title="Combate ao INSS"
            description="Conhecemos todas as brechas e erros que o INSS comete. Nossa taxa de reversão de negativas é de 99%."
          />
          <FeatureCard 
            icon={<Award className="w-10 h-10 text-amber-500" />}
            title="Especialistas Seniores"
            description="Você não será atendido por estagiários. Uma equipe com mais de 50 advogados seniores cuidará do seu caso."
          />
          <FeatureCard 
            icon={<HeartHandshake className="w-10 h-10 text-amber-500" />}
            title="Pagamento no Êxito"
            description="Confiamos tanto no nosso trabalho que em muitos casos você só paga quando receber o benefício."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-amber-500/30 hover:shadow-md transition-all group">
    <div className="mb-6 p-4 bg-amber-50 rounded-xl inline-block group-hover:bg-amber-100 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </div>
);