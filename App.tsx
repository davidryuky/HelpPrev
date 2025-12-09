import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { ContactForm } from './components/common/ContactForm';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { TeamPage } from './pages/TeamPage';
import { BlogPage } from './pages/BlogPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AdminPage } from './pages/AdminPage';

import { PageView } from './types';

const App: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<PageView>('home');

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setIsAdminRoute(true);
    } else {
      const hasVisited = sessionStorage.getItem('has_visited');
      if (!hasVisited) {
        fetch('/api/visits', { method: 'POST' })
          .then(() => sessionStorage.setItem('has_visited', 'true'))
          .catch(err => console.error('Erro ao registrar visita', err));
      }

      fetch('/api/settings')
        .then(async res => {
          if (!res.ok) return null;
          try { return await res.json(); } catch (e) { return null; }
        })
        .then(data => {
          if (data && data.head_scripts) {
             try {
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
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden relative">
      <Header onOpenModal={openModal} onNavigate={handleNavigate} currentView={currentView} />
      
      <main className="flex-grow">
        {currentView === 'home' && <HomePage onOpenModal={openModal} />}
        {currentView === 'about' && <AboutPage onOpenModal={openModal} />}
        {currentView === 'team' && <TeamPage onOpenModal={openModal} />}
        {currentView === 'blog' && <BlogPage onOpenModal={openModal} />}
        {currentView === 'privacy' && <PrivacyPage />}
      </main>

      <Footer onNavigate={handleNavigate} />
      <FloatingWhatsApp onClick={openModal} />

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
          <div className="absolute inset-0 -z-10" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
};

export default App;
