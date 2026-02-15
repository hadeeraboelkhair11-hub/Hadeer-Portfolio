
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../App';

interface HeroProps {
  lang: Language;
}

// Fixed TS errors for motion props by casting motion elements.
const MotionDiv = motion.div as any;
const MotionA = motion.a as any;

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const translations = {
    ar: {
      name: 'هدير أبو الخير',
      title: 'Senior Graphic Designer & Creative Solutions',
      bio: 'Senior Graphic Designer بخبرة من 2016 حتى الآن. أعمل حالياً في سلطنة عمان، ولدي خبرة في العمل داخل عدة شركات ووكالات إعلانية في عمان والسعودية ومصر، إلى جانب عملي الخاص كفريلانس. متخصصة في الهوية البصرية، التصميم الإعلاني، تصميم السوشيال ميديا، كما أعمل كـ AI Creator و Website Creator لتقديم حلول إبداعية متكاملة للبراندات.',
      btnGallery: 'مشاهدة المعرض',
      btnContact: 'تواصل معي مباشر',
      stats: [
        { label: 'عاماً من الخبرة الرقمية', value: '10+' },
        { label: 'مشروعاً إبداعياً مكتمل', value: '900+' },
        { label: 'دولة حول العالم', value: '5+' },
      ]
    },
    en: {
      name: 'Hadeer Aboelkhair',
      title: 'Senior Graphic Designer & Creative Solutions',
      bio: 'Senior Graphic Designer since 2016. Currently based in Oman, with experience working in multiple advertising agencies across Oman, KSA, and Egypt, alongside my private freelance work. Specialized in visual identity, advertising design, social media design, and working as an AI Creator and Website Creator to provide integrated creative solutions for brands.',
      btnGallery: 'View Portfolio',
      btnContact: 'Direct Contact',
      stats: [
        { label: 'Years of Digital Experience', value: '10+' },
        { label: 'Creative Projects Completed', value: '900+' },
        { label: 'Countries Worldwide', value: '5+' },
      ]
    }
  };

  const content = translations[lang];
  const whatsappUrl = "https://api.whatsapp.com/send?phone=96874115401";
  const profileImageUrl = "https://l.top4top.io/p_3694jjr3o1.png";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-12 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <MotionDiv 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(197,160,89,0.08)_0%,transparent_70%)]"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 relative inline-block"
        >
          <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto">
            <MotionDiv 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border border-[#c5a059]/30 rounded-full border-dashed"
            />
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#c5a059] shadow-[0_0_40px_rgba(197,160,89,0.3)] bg-[#2d0101]">
              <img 
                src={profileImageUrl} 
                alt={content.name} 
                className="w-full h-full object-cover object-[center_20%] scale-110"
              />
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-5xl font-[900] leading-[1.1] mb-6 tracking-tighter gold-shimmer">
            {content.name}
          </h1>
          <p className="text-[#c5a059] font-black text-[10px] md:text-xs tracking-[0.2em] mb-8 uppercase">
            {content.title}
          </p>

          <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md p-8 rounded-[30px] border border-white/10 mb-12 shadow-2xl">
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-bold text-center">
              {content.bio}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <MotionA 
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(197,160,89,0.3)" }}
              whileTap={{ scale: 0.95 }}
              href="#portfolio" 
              className="bg-[#c5a059] text-[#2d0101] px-12 py-4 rounded-2xl font-black text-sm transition-all w-full sm:w-auto"
            >
              {content.btnGallery}
            </MotionA>
            <MotionA 
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
              href={whatsappUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-white px-12 py-4 rounded-2xl font-black text-sm backdrop-blur-sm transition-all w-full sm:w-auto text-center"
            >
              {content.btnContact}
            </MotionA>
          </div>
        </MotionDiv>
      </div>

      <MotionDiv 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="max-w-4xl mx-auto w-full mt-24 grid grid-cols-3 gap-8 px-6 border-t border-white/5 pt-12 relative z-10"
      >
        {content.stats.map((stat, i) => (
          <div key={i} className="text-center group">
            <div className="text-xl md:text-3xl font-black text-white mb-1 group-hover:text-[#c5a059] transition-colors">{stat.value}</div>
            <div className="text-[8px] md:text-[9px] font-bold text-[#c5a059] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</div>
          </div>
        ))}
      </MotionDiv>
    </div>
  );
};

export default Hero;
