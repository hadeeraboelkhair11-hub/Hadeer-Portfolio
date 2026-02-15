
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import ProcessSection from './components/ProcessSection';
import PortfolioGrid from './components/PortfolioGrid';
import ReviewsSection from './components/ReviewsSection';
import AIConsultant from './components/AIConsultant';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export type Language = 'ar' | 'en';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [lang, setLang] = useState<Language>('ar');

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

  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen selection:bg-[#c5a059] selection:text-[#2d0101]">
      <Header activeSection={activeSection} lang={lang} setLang={setLang} />
      
      <main>
        <section id="home" className="rich-bg text-white">
          <Hero lang={lang} />
        </section>

        <section id="services" className="py-32 px-6 relative bg-[#f9f7f2] marble-texture">
          <ServicesSection lang={lang} />
        </section>

        <section id="process" className="py-32 px-6 bg-white border-b border-[#2d0101]/5">
          <ProcessSection lang={lang} />
        </section>

        <section id="portfolio" className="py-32 px-6 bg-[#0f0f0f] text-white overflow-hidden">
          <PortfolioGrid lang={lang} />
        </section>

        <section id="ai-consultant" className="py-32 px-6 bg-[#f9f7f2] marble-texture">
          <AIConsultant />
        </section>

        <section id="reviews" className="py-32 px-6 bg-[#2d0101] text-white">
          <ReviewsSection lang={lang} />
        </section>

        <section id="contact" className="py-32 px-6 bg-white">
          <ContactForm lang={lang} />
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
};

export default App;
