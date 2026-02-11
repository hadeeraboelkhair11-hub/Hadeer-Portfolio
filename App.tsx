
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import ProcessSection from './components/ProcessSection';
import PortfolioGrid from './components/PortfolioGrid';
import ReviewsSection from './components/ReviewsSection';
import ContactForm from './components/ContactForm';
import AIConsultant from './components/AIConsultant';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'portfolio', 'reviews', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-[#c5a059] selection:text-[#2d0101]">
      <Header activeSection={activeSection} />
      
      <main>
        <section id="home" className="rich-bg text-white">
          <Hero />
        </section>

        <section id="services" className="py-32 px-6 relative bg-[#f9f7f2] marble-texture">
          <ServicesSection />
        </section>

        <section id="process" className="py-32 px-6 bg-white border-b border-[#2d0101]/5">
          <ProcessSection />
        </section>

        <section id="ai-advisor" className="py-32 px-6 bg-[#f9f7f2] overflow-hidden">
          <AIConsultant />
        </section>

        <section id="portfolio" className="py-32 px-6 bg-[#0f0f0f] text-white overflow-hidden">
          <PortfolioGrid />
        </section>

        <section id="reviews" className="py-32 px-6 bg-[#2d0101] text-white">
          <ReviewsSection />
        </section>

        <section id="contact" className="py-32 px-6 bg-white">
          <ContactForm />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
