
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../App';

interface HeaderProps {
  activeSection: string;
  lang: Language;
  setLang: (lang: Language) => void;
}

// Fixed TS errors for motion props by casting the motion component.
const MotionHeader = motion.header as any;

const Header: React.FC<HeaderProps> = ({ activeSection, lang, setLang }) => {
  const translations = {
    ar: [
      { label: 'البداية', id: 'home' },
      { label: 'الخدمات', id: 'services' },
      { label: 'المعرض', id: 'portfolio' },
      { label: 'الآراء', id: 'reviews' },
      { label: 'تواصل', id: 'contact' },
    ],
    en: [
      { label: 'Home', id: 'home' },
      { label: 'Services', id: 'services' },
      { label: 'Portfolio', id: 'portfolio' },
      { label: 'Reviews', id: 'reviews' },
      { label: 'Contact', id: 'contact' },
    ]
  };

  const navItems = translations[lang];

  return (
    <MotionHeader 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-8 md:px-16 py-4 flex justify-between items-center border-b border-[#2d0101]/5"
    >
      <div className="flex flex-col group cursor-pointer">
        <span className="text-lg md:text-xl font-black text-[#2d0101] leading-none tracking-tight">
          {lang === 'ar' ? 'هدير أبو الخير' : 'Hadeer Aboelkhair'}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-4 h-[2px] bg-[#c5a059]"></span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#c5a059] font-black italic">
            {lang === 'ar' ? 'كبير مصممين إبداعيين' : 'Senior Creative Director'}
          </span>
        </div>
      </div>
      
      <nav className="hidden lg:flex gap-8">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${
              activeSection === item.id ? 'text-[#c5a059] border-b-2 border-[#c5a059] pb-1' : 'text-slate-400 hover:text-[#2d0101]'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-[#2d0101]/5 p-1 rounded-full border border-[#2d0101]/10">
          <button 
            onClick={() => setLang('ar')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'ar' ? 'bg-[#2d0101] text-white shadow-md' : 'text-[#2d0101] hover:bg-white/50'}`}
          >
            AR
          </button>
          <button 
            onClick={() => setLang('en')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === 'en' ? 'bg-[#2d0101] text-white shadow-md' : 'text-[#2d0101] hover:bg-white/50'}`}
          >
            EN
          </button>
        </div>
      </div>
    </MotionHeader>
  );
};

export default Header;
