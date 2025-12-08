import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { WhyUs } from './components/WhyUs';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { CTASection } from './components/CTASection';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Admin } from './components/Admin';
import { ContactForm } from './components/ContactForm';

const App: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Verificação simples de rota
    if (window.location.pathname === '/admin') {
      setIsAdminRoute(true);
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden relative">
      <Header onOpenModal={openModal} />
      <main>
        <Hero onOpenModal={openModal} />
        <Stats />
        <WhyUs />
        <Services onOpenModal={openModal} />
        <CTASection />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <FloatingWhatsApp onClick={openModal} />

      {/* Modal / Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl w-full max-w-lg relative shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-red-500 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <ContactForm isModal={true} onSuccess={() => setTimeout(closeModal, 2500)} />
          </div>
          {/* Overlay click to close */}
          <div className="absolute inset-0 -z-10" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
};

export default App;