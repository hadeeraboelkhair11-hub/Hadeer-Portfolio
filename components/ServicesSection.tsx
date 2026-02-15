
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../App';

interface ServicesSectionProps {
  lang: Language;
}

// Fixed TS errors for motion props by casting motion elements.
const MotionSpan = motion.span as any;
const MotionH2 = motion.h2 as any;
const MotionDiv = motion.div as any;

const ServicesSection: React.FC<ServicesSectionProps> = ({ lang }) => {
  const translations = {
    ar: {
      tag: 'خدماتنا الاحترافية',
      title: 'حلول إبداعية متكاملة',
      more: 'تعرف على المزيد',
      services: [
        {
          title: 'مواقع تعريفية ومتاجر إلكترونية',
          platforms: 'SALLA • ZID • SHOPIFY • WOO',
          desc: 'إنشاء مواقع تعريفية أو منصات بيع وشراء احترافية مصممة خصيصاً لرفع معدلات التحويل وزيادة المبيعات بأعلى معايير الجودة.',
          icon: '🛍️'
        },
        {
          title: 'استوديو الإعلان AI',
          platforms: 'صور وفيديوهات سينمائية',
          desc: 'إنتاج محتوى بصري متكامل (صور وفيديوهات) لمنتجاتك باستخدام تقنيات الذكاء الاصطناعي الأكثر تطوراً.',
          icon: '🪄'
        },
        {
          title: 'الهوية البصرية',
          platforms: 'BRANDING & LOGOS',
          desc: 'تصميم هويات بصرية متكاملة تعبر عن فلسفة مشروعك وتصنع له حضوراً قوياً في السوق.',
          icon: '🏛️'
        }
      ]
    },
    en: {
      tag: 'Professional Services',
      title: 'Integrated Creative Solutions',
      more: 'Learn More',
      services: [
        {
          title: 'E-Commerce & Websites',
          platforms: 'SALLA • ZID • SHOPIFY • WOO',
          desc: 'Creating professional informative sites or sales platforms specifically designed to increase conversion rates with the highest quality standards.',
          icon: '🛍️'
        },
        {
          title: 'AI Advertising Studio',
          platforms: 'Cinematic Images & Videos',
          desc: 'Producing integrated visual content (photos and videos) for your products using the most advanced AI techniques.',
          icon: '🪄'
        },
        {
          title: 'Visual Identity',
          platforms: 'BRANDING & LOGOS',
          desc: 'Designing integrated visual identities that reflect your business philosophy and create a strong market presence.',
          icon: '🏛️'
        }
      ]
    }
  };

  const content = translations[lang];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-24 text-center">
        <MotionSpan 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[#c5a059] font-black text-[10px] tracking-widest uppercase mb-4"
        >
          {content.tag}
        </MotionSpan>
        <MotionH2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-black text-[#2d0101]"
        >
          {lang === 'ar' ? (
            <>حلول <span className="text-[#c5a059]">إبداعية</span> متكاملة</>
          ) : (
            <>Integrated <span className="text-[#c5a059]">Creative</span> Solutions</>
          )}
        </MotionH2>
        <MotionDiv 
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          className="h-1 bg-[#c5a059] mt-6"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {content.services.map((service, index) => (
          <MotionDiv 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ y: -15 }}
            className="p-10 rounded-[50px] bg-white border border-[#2d0101]/5 shadow-xl hover:shadow-[0_40px_80px_rgba(45,1,1,0.1)] transition-all duration-500 flex flex-col items-center text-center group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="w-20 h-20 rounded-[24px] bg-[#2d0101]/5 flex items-center justify-center text-4xl mb-8 group-hover:bg-[#c5a059] group-hover:text-white group-hover:scale-110 transition-all duration-500 relative z-10">
              {service.icon}
            </div>
            
            <h3 className="text-xl font-black mb-2 text-[#2d0101] relative z-10">{service.title}</h3>
            <p className="text-[#c5a059] font-black text-[9px] mb-6 tracking-[0.2em] uppercase relative z-10">{service.platforms}</p>
            <p className="text-slate-500 leading-relaxed font-medium text-sm relative z-10">{service.desc}</p>
            
            <MotionDiv 
              className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-[#c5a059] font-black text-[10px] cursor-pointer flex items-center gap-2">
                {content.more} <span className="text-lg">←</span>
              </span>
            </MotionDiv>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
