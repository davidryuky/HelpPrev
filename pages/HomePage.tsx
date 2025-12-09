import React from 'react';
import { Hero } from '../components/sections/Hero';
import { Stats } from '../components/sections/Stats';
import { WhyUs } from '../components/sections/WhyUs';
import { Services } from '../components/sections/Services';
import { CTASection } from '../components/sections/CTASection';
import { Testimonials } from '../components/sections/Testimonials';
import { FAQ } from '../components/sections/FAQ';
import { DataSecurity } from '../components/sections/DataSecurity';

interface HomePageProps {
  onOpenModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenModal }) => {
  return (
    <>
      <Hero onOpenModal={onOpenModal} />
      <Stats />
      <WhyUs />
      <Services onOpenModal={onOpenModal} />
      <CTASection />
      <Testimonials />
      <FAQ />
      <DataSecurity onOpenModal={onOpenModal} />
    </>
  );
};
