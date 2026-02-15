
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../App';

interface ProcessSectionProps {
  lang: Language;
}

// Fixed TS errors for motion props by casting motion elements.
const MotionDiv = motion.div as any;

const ProcessSection: React.FC<ProcessSectionProps> = ({ lang }) => {
  const translations = {
    ar: {
      tag: 'Our Methodology',
      title: 'رحلة الإبداع',
      steps: [
        { title: 'التخطيط الاستراتيجي', desc: 'دراسة السوق وتحليل الجمهور المستهدف لمشروعك لضمان أفضل انطلاقة.' },
        { title: 'التصميم الإبداعي', desc: 'بناء واجهات عصرية تعكس فخامة علامتك التجارية وتجذب الأنظار.' },
        { title: 'التطوير المتكامل', desc: 'تحويل الأفكار إلى واقع رقمي سريع، متجاوب، ومتوافق مع جميع المنصات.' },
        { title: 'الإطلاق والدعم', desc: 'مراجعة نهائية، اختبار الأداء، وإطلاق المشروع مع دعم مستمر للنمو.' }
      ]
    },
    en: {
      tag: 'Our Methodology',
      title: 'Creative Journey',
      steps: [
        { title: 'Strategic Planning', desc: 'Market study and target audience analysis for your project to ensure the best launch.' },
        { title: 'Creative Design', desc: 'Building modern interfaces that reflect your brand luxury and catch the eye.' },
        { title: 'Integrated Development', desc: 'Transforming ideas into fast, responsive digital reality compatible with all platforms.' },
        { title: 'Launch & Support', desc: 'Final review, performance testing, and project launch with ongoing growth support.' }
      ]
    }
  };

  const content = translations[lang];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-24">
        <span className="text-[#c5a059] font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">{content.tag}</span>
        <h2 className="text-4xl font-black text-[#2d0101]">
          {lang === 'ar' ? (
            <>رحلة <span className="text-[#c5a059]">الإبداع</span></>
          ) : (
            <>Creative <span className="text-[#c5a059]">Journey</span></>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
        <div className="hidden md:block absolute top-10 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent z-0"></div>
        
        {content.steps.map((step, index) => (
          <MotionDiv 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center text-center relative z-10 group"
          >
            <div className="w-16 h-16 rounded-full bg-white border-2 border-[#c5a059] text-[#2d0101] flex items-center justify-center text-xl font-black mb-8 shadow-xl group-hover:bg-[#2d0101] group-hover:text-white group-hover:scale-110 transition-all duration-500">
              {index + 1}
            </div>
            <h3 className="text-lg font-black mb-4 text-[#2d0101]">{step.title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-bold">{step.desc}</p>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

export default ProcessSection;
