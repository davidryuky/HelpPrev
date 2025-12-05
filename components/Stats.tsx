import React from 'react';

export const Stats: React.FC = () => {
  const stats = [
    { value: "99%", label: "Taxa de Sucesso", desc: "Em reversões administrativas e judiciais" },
    { value: "+5.000", label: "Casos Aprovados", desc: "Famílias com seus direitos garantidos" },
    { value: "24h", label: "Agilidade", desc: "Prazo máximo para primeira análise" },
    { value: "+50", label: "Advogados", desc: "Equipe especializada e dedicada a você" }
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