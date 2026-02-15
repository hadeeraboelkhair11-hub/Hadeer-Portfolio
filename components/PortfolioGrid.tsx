
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../App';

interface PortfolioGridProps {
  lang: Language;
}

// Fixed TS errors for motion props by casting motion elements.
const MotionDiv = motion.div as any;

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ lang }) => {
  const [filter, setFilter] = useState<'all' | 'store' | 'ai'>('all');
  const whatsappUrl = "https://api.whatsapp.com/send?phone=96874115401";

  const translations = {
    ar: {
      tag: 'Creative Portfolio',
      title: 'مختارات من أعمالي',
      highlight: 'أعمالي',
      filters: [
        { id: 'all', label: 'الكل' },
        { id: 'store', label: 'المتاجر' },
        { id: 'ai', label: 'دعاية الـ AI' }
      ],
      btnDiscuss: 'ناقش الفكرة',
      btnVisit: 'زيارة الموقع',
      categories: {
        ai: 'Digital Art & Motion',
        store: 'Professional E-Store'
      },
      projects: [
        { id: 1, title: 'موقع إيكو كود الكويت', category: 'store', image: 'https://i.top4top.io/p_3698rh8lh1.png', desc: 'إنشاء وتصميم موقع تعريفي احترافي', link: 'https://ecocode-kw.com' },
        { id: 2, title: 'متجر وموقع دكان العسل', category: 'store', image: 'https://d.top4top.io/p_3698rstoh1.png', desc: 'إنشاء موقع ومتجر بمكان واحد مع العديد من المزايا', link: 'https://ritajinternational.com/dukan-alasal/' },
        { id: 3, title: 'متجر جوليانا للملابس سعودي', category: 'store', image: 'https://b.top4top.io/p_36980en671.jpeg', desc: 'منصه تسوق للفاشون فخمة متكاملة', link: 'https://jolinafashion.com/' },
        { id: 4, title: 'دكان العسل العماني', category: 'ai', image: 'https://f.top4top.io/p_3698xntm51.png', desc: 'خلق واقع افتراضى مبهر للمنتجات عبر الـ AI', link: 'https://www.instagram.com/dukan_alasal/' },
        { id: 5, title: 'براند زهو', category: 'ai', image: 'https://k.top4top.io/p_3698wwv0c1.png', desc: 'إنتاج اعلاني متكامل بالذكاء الاصطناعي ( صور و فيديو )', link: 'https://www.instagram.com/zaho.designs/?hl=ar' },
        { id: 6, title: 'براند صوغات مجان', category: 'store', image: 'https://k.top4top.io/p_36984yqkm1.jpeg', desc: 'تصاميم تركز على الحرفية وزيادة المبيعات', link: 'https://www.instagram.com/sougat.majan/?hl=ar' }
      ]
    },
    en: {
      tag: 'Creative Portfolio',
      title: 'Selected Works',
      highlight: 'Works',
      filters: [
        { id: 'all', label: 'All' },
        { id: 'store', label: 'E-Stores' },
        { id: 'ai', label: 'AI Ads' }
      ],
      btnDiscuss: 'Discuss Idea',
      btnVisit: 'Visit Site',
      categories: {
        ai: 'Digital Art & Motion',
        store: 'Professional E-Store'
      },
      projects: [
        { id: 1, title: 'EcoCode Kuwait', category: 'store', image: 'https://i.top4top.io/p_3698rh8lh1.png', desc: 'Professional informative website design', link: 'https://ecocode-kw.com' },
        { id: 2, title: 'Dokan Al-Asal Store', category: 'store', image: 'https://d.top4top.io/p_3698rstoh1.png', desc: 'Integrated website and store with advanced features', link: 'https://ritajinternational.com/dukan-alasal/' },
        { id: 3, title: 'Juliana Fashion Store', category: 'store', image: 'https://b.top4top.io/p_36980en671.jpeg', desc: 'Luxury fashion shopping platform', link: 'https://jolinafashion.com/' },
        { id: 4, title: 'Omani Honey Ads', category: 'ai', image: 'https://f.top4top.io/p_3698xntm51.png', desc: 'Stunning virtual reality for products via AI', link: 'https://www.instagram.com/dukan_alasal/' },
        { id: 5, title: 'Zahoo Brand', category: 'ai', image: 'https://k.top4top.io/p_3698wwv0c1.png', desc: 'Full AI advertising production (Photos & Video)', link: 'https://www.instagram.com/zaho.designs/?hl=ar' },
        { id: 6, title: 'Soghat Majan Brand', category: 'store', image: 'https://k.top4top.io/p_36984yqkm1.jpeg', desc: 'Designs focusing on craftsmanship and sales', link: 'https://www.instagram.com/sougat.majan/?hl=ar' }
      ]
    }
  };

  const content = translations[lang];
  const filteredProjects = filter === 'all' ? content.projects : content.projects.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <div>
          <span className="text-[#c5a059] font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">{content.tag}</span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            {lang === 'ar' ? (
              <>مختارات من <br/> <span className="text-[#c5a059]">{content.highlight}</span></>
            ) : (
              <>Selected <br/> <span className="text-[#c5a059]">{content.highlight}</span></>
            )}
          </h2>
        </div>
        
        <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
          {content.filters.map((btn) => (
            <button 
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${
                filter === btn.id 
                ? 'bg-[#c5a059] text-[#2d0101] shadow-lg' 
                : 'text-slate-400 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <MotionDiv layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <MotionDiv 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={project.id} 
              className="group relative h-[500px] rounded-[48px] overflow-hidden shadow-2xl border border-white/5"
            >
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d0101] via-[#2d0101]/30 to-transparent p-10 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                <span className="text-[#c5a059] text-[9px] font-black uppercase tracking-[0.4em] mb-3">
                  {project.category === 'ai' ? content.categories.ai : content.categories.store}
                </span>
                <h3 className="text-xl font-black text-white mb-2">{project.title}</h3>
                <p className="text-slate-300 text-[10px] mb-8 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  {project.desc}
                </p>
                
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                  <a 
                    href={project.link} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white text-[#2d0101] py-3 rounded-xl text-[9px] font-black hover:bg-[#c5a059] transition-all text-center uppercase tracking-wider"
                  >
                    {content.btnVisit}
                  </a>
                  <a 
                    href={whatsappUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#c5a059] text-[#2d0101] py-3 rounded-xl text-[9px] font-black hover:bg-white transition-all text-center uppercase tracking-wider"
                  >
                    {content.btnDiscuss}
                  </a>
                </div>
              </div>
            </MotionDiv>
          ))}
        </AnimatePresence>
      </MotionDiv>
    </div>
  );
};

export default PortfolioGrid;
