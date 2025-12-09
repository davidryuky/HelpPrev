import React from 'react';

export const Stats: React.FC = () => {
  const stats = [
    { value: "Gratuito", label: "Para encontrar", desc: "Você não paga nada para usar nossa plataforma" },
    { value: "+5.000", label: "Pessoas Ajudadas", desc: "Famílias com seus direitos garantidos" },
    { value: "24h", label: "Agilidade", desc: "Tempo médio para um advogado te chamar" },
    { value: "+50", label: "Advogados Parceiros", desc: "Rede de especialistas verificados em todo Brasil" }
  ];

  return (
    <section className="bg-white py-12 -mt-10 relative z-20 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-slate-100 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</div>
            <div className="text-amber-600 font-bold text-lg mb-1">{stat.label}</div>
            <p className="text-slate-500 text-sm">{stat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
