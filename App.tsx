import React, { useState, useEffect } from 'react';
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

const App: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    // Verificação simples de rota
    if (window.location.pathname === '/admin') {
      setIsAdminRoute(true);
    }
  }, []);

  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Stats />
        <WhyUs />
        <Services />
        <CTASection />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default App;