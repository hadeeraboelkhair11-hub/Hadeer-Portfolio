
import React from 'react';
import { Language } from '../App';

// Added interface for props to include 'lang'
interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=96874115401";

  const translations = {
    ar: {
      name: 'هدير أبو الخير',
      role: 'Senior Creative Director',
      desc: 'نصنع الفخامة الرقمية بخبرة تمتد لأكثر من 10 سنوات في عالم التصميم والمتاجر الإلكترونية.',
      contactTitle: 'تواصل سريع',
      location: 'سلطنة عُمان - دول الخليج',
      platformsTitle: 'المنصات',
      rights: `© ${new Date().getFullYear()} HADEER ABO ELKHAIR. جميع الحقوق محفوظة.`
    },
    en: {
      name: 'Hadeer Aboelkhair',
      role: 'Senior Creative Director',
      desc: 'Creating digital luxury with over 10 years of experience in design and e-commerce.',
      contactTitle: 'Quick Contact',
      location: 'Oman - GCC Countries',
      platformsTitle: 'Platforms',
      rights: `© ${new Date().getFullYear()} HADEER ABO ELKHAIR. ALL RIGHTS RESERVED.`
    }
  };

  const content = translations[lang];

  return (
    <footer className="bg-[#050505] pt-32 pb-16 px-8 border-t border-[#c5a059]/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
        <div className="space-y-8">
          <div className="flex flex-col">
            <span className="text-4xl font-black text-white">{content.name}</span>
            <span className="text-xs uppercase tracking-[0.4em] text-[#c5a059] font-bold mt-2">{content.role}</span>
          </div>
          <p className="text-slate-500 leading-relaxed text-lg max-w-sm">
            {content.desc}
          </p>
        </div>

        <div className="space-y-8">
          <h4 className="text-[#c5a059] font-black text-xl uppercase tracking-widest">{content.contactTitle}</h4>
          <ul className="space-y-4 text-slate-400 text-lg">
            <li><a href="mailto:hadeer.aboelkhair11@gmail.com" className="hover:text-white transition-all">hadeer.aboelkhair11@gmail.com</a></li>
            <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">+968 7411 5401</a></li>
            <li className="text-sm opacity-50">{content.location}</li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[#c5a059] font-black text-xl uppercase tracking-widest">{content.platformsTitle}</h4>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
            <span className="px-4 py-2 glass rounded-lg">SALLA</span>
            <span className="px-4 py-2 glass rounded-lg">ZID</span>
            <span className="px-4 py-2 glass rounded-lg">SHOPIFY</span>
            <span className="px-4 py-2 glass rounded-lg">WOO</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 text-center">
        <p className="text-slate-700 text-sm font-bold tracking-widest uppercase">
          {content.rights}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
