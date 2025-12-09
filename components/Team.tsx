import React from 'react';
import { Linkedin, Mail, CheckCircle } from 'lucide-react';

interface TeamProps {
  onOpenModal: () => void;
}

const teamMembers = [
  {
    name: "Dr. Carlos Mendes",
    role: "Parceiro Especialista - São Paulo",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Advogado com foco total em reverter negativas do INSS. Referência em auxílio-doença."
  },
  {
    name: "Dra. Ana Paula Souza",
    role: "Parceira Especialista - Minas Gerais",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Expert em BPC/LOAS. Já ajudou centenas de famílias de baixa renda a conseguirem o benefício."
  },
  {
    name: "Dr. Roberto Almeida",
    role: "Parceiro Especialista - Rio de Janeiro",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Focado em Aposentadoria Especial para quem trabalhou em condições perigosas."
  },
  {
    name: "Dra. Juliana Costa",
    role: "Parceira Especialista - Bahia",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Especialista em Salário Maternidade e Pensão por Morte. Agilidade e humanidade no atendimento."
  }
];

export const Team: React.FC<TeamProps> = ({ onOpenModal }) => {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <section className="container mx-auto px-4 mb-16 text-center">
        <span className="text-amber-500 font-bold tracking-wider uppercase text-sm">Nossa Rede de Confiança</span>
        <h1 className="text-4xl font-extrabold text-slate-900 mt-3 mb-6">Exemplos de Especialistas da Rede</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Temos contatos com mais de 50 advogados altamente qualificados em todo o Brasil. Abaixo, alguns dos perfis que podem atender você.
        </p>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 group hover:shadow-xl transition-all">
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                <p className="text-amber-600 font-medium text-sm mb-4">{member.role}</p>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wide">
                  <CheckCircle size={14} /> Cadastro Verificado
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Quer que um desses especialistas te ligue?</h2>
            <p className="text-slate-300">É simples, rápido e sem custo inicial.</p>
          </div>
          <button 
            onClick={onOpenModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-lg whitespace-nowrap transition-colors shadow-lg"
          >
            Quero receber uma ligação
          </button>
        </div>
      </section>
    </div>
  );
};