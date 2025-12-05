import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a 
      href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20advogado%20sobre%20meu%20benef%C3%ADcio."
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
    >
      <div className="bg-white text-slate-900 text-sm font-bold py-2 px-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity absolute right-full mr-4 whitespace-nowrap hidden md:block">
        Fale conosco agora!
      </div>
      <div className="bg-[#25D366] p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all transform hover:scale-110 flex items-center justify-center relative">
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
        </span>
        <MessageCircle size={32} color="white" fill="white" />
      </div>
    </a>
  );
};