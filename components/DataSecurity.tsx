import React from 'react';
import { ShieldCheck, Lock, UserCheck, ArrowRight } from 'lucide-react';

interface DataSecurityProps {
  onOpenModal: () => void;
}

export const DataSecurity: React.FC<DataSecurityProps> = ({ onOpenModal }) => {
  return (
    <section className="bg-white py-16 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
              <ShieldCheck className="text-green-600" /> Como usaremos seus dados?
            </h2>
            <p className="text-slate-600 text-lg">
              Transparência é a base do nosso serviço.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0 bg-white p-4 rounded-full shadow-md">
                <Lock className="w-12 h-12 text-amber-500" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sigilo Profissional Absoluto</h3>
                <p className="text-slate-700 leading-relaxed">
                  Todas as informações prestadas são compartilhadas <strong className="text-slate-900 bg-amber-100 px-1 rounded">APENAS COM OS ADVOGADOS</strong> da nossa base que tiverem a especialidade necessária e interesse em resolver a sua demanda.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Não vendemos seus dados. Não fazemos spam. Seu contato é restrito à solução do seu caso jurídico.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-center items-center gap-6">
              <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                <UserCheck size={18} className="text-green-600" />
                Advogados Verificados
              </div>
              <button 
                onClick={onOpenModal}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:-translate-y-1 flex items-center gap-2 shadow-lg"
              >
                Encaminhar caso para especialistas <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};