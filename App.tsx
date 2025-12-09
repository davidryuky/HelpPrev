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
import { About } from './components/About';
import { Team } from './components/Team';
import { Blog } from './components/Blog';
import { Privacy } from './components/Privacy';
import { DataSecurity } from './components/DataSecurity';

export type PageView = 'home' | 'about' | 'team' | 'blog' | 'privacy';

const App: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<PageView>('home');

  useEffect(() => {
    // 1. Verificação de Rota Admin
    if (window.location.pathname === '/admin') {
      setIsAdminRoute(true);
    } else {
      // 2. Registro de Visita
      const hasVisited = sessionStorage.getItem('has_visited');
      if (!hasVisited) {
        fetch('/api/visits', { method: 'POST' })
          .then(() => sessionStorage.setItem('has_visited', 'true'))
          .catch(err => console.error('Erro ao registrar visita', err));
      }

      // 3. Injeção de Scripts Globais (Configurações do Admin)
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.head_scripts) {
             try {
                // Cria um fragmento contextual para transformar a string HTML em nós DOM reais
                // Isso permite que tags <script> sejam executadas corretamente
                const range = document.createRange();
                range.selectNode(document.head);
                const fragment = range.createContextualFragment(data.head_scripts);
                document.head.appendChild(fragment);
             } catch (e) {
               console.error('Erro ao injetar scripts personalizados:', e);
             }
          }
        })
        .catch(err => console.error('Erro ao buscar configurações', err));
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden relative">
      <Header onOpenModal={openModal} onNavigate={handleNavigate} currentView={currentView} />
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero onOpenModal={openModal} />
            <Stats />
            <WhyUs />
            <Services onOpenModal={openModal} />
            <CTASection />
            <Testimonials />
            <FAQ />
            <DataSecurity onOpenModal={openModal} />
          </>
        )}

        {currentView === 'about' && <About onOpenModal={openModal} />}
        {currentView === 'team' && <Team onOpenModal={openModal} />}
        {currentView === 'blog' && <Blog onOpenModal={openModal} />}
        {currentView === 'privacy' && <Privacy />}
      </main>

      <Footer onNavigate={handleNavigate} />
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
              className="absolute top-4 right-4 z-50 bg-slate-200 hover:bg-red-100 text-slate-600 hover:text-red-600 p-2 rounded-full transition-colors shadow-sm"
              title="Fechar"
            >
              <X size={20} />
            </button>
            <ContactForm isModal={true} onSuccess={() => {}} />
          </div>
          {/* Overlay click to close */}
          <div className="absolute inset-0 -z-10" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
};

export default App;