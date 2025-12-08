import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

interface TeamProps {
  onOpenModal: () => void;
}

const teamMembers = [
  {
    name: "Dr. Carlos Mendes",
    role: "Sócio Fundador & Especialista em INSS",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Com 15 anos de experiência, Dr. Carlos já reverteu mais de 2.000 casos considerados 'perdidos' por outros advogados."
  },
  {
    name: "Dra. Ana Paula Souza",
    role: "Coordenadora Jurídica",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Especialista em BPC/LOAS e auxílios por incapacidade. Sua tese sobre revisão de benefícios é referência nacional."
  },
  {
    name: "Dr. Roberto Almeida",
    role: "Advogado Sênior",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Focado em Aposentadoria Especial, luta pelos direitos de quem trabalhou em condições insalubres."
  },
  {
    name: "Dra. Juliana Costa",
    role: "Gestora de Atendimento",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Responsável por garantir que cada cliente seja ouvido com empatia e tenha respostas rápidas sobre seu processo."
  }
];

export const Team: React.FC<TeamProps> = ({ onOpenModal }) => {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <section className="container mx-auto px-4 mb-16 text-center">
        <span className="text-amber-500 font-bold tracking-wider uppercase text-sm">Nossos Especialistas</span>
        <h1 className="text-4xl font-extrabold text-slate-900 mt-3 mb-6">Conheça quem vai lutar por você</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Não somos robôs. Somos uma equipe de elite, apaixonada por justiça e altamente qualificada para enfrentar o INSS.
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
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors">
                    <Linkedin size={20} />
                  </button>
                  <button className="text-slate-400 hover:text-amber-600 transition-colors">
                    <Mail size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Precisa da ajuda desses especialistas?</h2>
            <p className="text-slate-300">Não deixe seu direito na mão de amadores.</p>
          </div>
          <button 
            onClick={onOpenModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-lg whitespace-nowrap transition-colors shadow-lg"
          >
            Falar com a Equipe
          </button>
        </div>
      </section>
    </div>
  );
};