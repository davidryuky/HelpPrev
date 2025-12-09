import React from 'react';
import { MousePointerClick, ShieldCheck, UserCheck, Banknote } from 'lucide-react';

export const WhyUs: React.FC = () => {
  return (
    <section id="diferenciais" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Por que usar o MeuPrev?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Facilitamos sua vida. Em vez de procurar em listas telefônicas ou na rua, nós trazemos o especialista até a tela do seu celular.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<MousePointerClick className="w-10 h-10 text-amber-500" />}
            title="Tudo Online"
            description="Você não precisa pegar ônibus ou ir até um escritório. Resolvemos tudo pelo WhatsApp."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-10 h-10 text-amber-500" />}
            title="Segurança Total"
            description="Só trabalhamos com advogados verificados e especialistas em INSS. Nada de aventureiros."
          />
          <FeatureCard 
            icon={<UserCheck className="w-10 h-10 text-amber-500" />}
            title="O Advogado Certo"
            description="Analisamos seu problema e te conectamos com quem realmente entende do assunto."
          />
          <FeatureCard 
            icon={<Banknote className="w-10 h-10 text-amber-500" />}
            title="Pagamento no Êxito"
            description="Nossos parceiros geralmente só cobram quando você recebe o dinheiro. Sem sustos."
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
