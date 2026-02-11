
import React from 'react';
import { motion } from 'framer-motion';

const ProcessSection: React.FC = () => {
  const steps = [
    { title: 'التخطيط الاستراتيجي', desc: 'دراسة السوق وتحليل الجمهور المستهدف لمشروعك لضمان أفضل انطلاقة.' },
    { title: 'التصميم الإبداعي', desc: 'بناء واجهات عصرية تعكس فخامة علامتك التجارية وتجذب الأنظار.' },
    { title: 'التطوير المتكامل', desc: 'تحويل الأفكار إلى واقع رقمي سريع، متجاوب، ومتوافق مع جميع المنصات.' },
    { title: 'الإطلاق والدعم', desc: 'مراجعة نهائية، اختبار الأداء، وإطلاق المشروع مع دعم مستمر للنمو.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-24">
        <span className="text-[#c5a059] font-black text-xs tracking-[0.4em] uppercase mb-4 block">Our Methodology</span>
        <h2 className="text-5xl font-black text-[#2d0101]">رحلة <span className="text-[#c5a059]">الإبداع</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
        {/* Connection Line (Hidden on Mobile) */}
        <div className="hidden md:block absolute top-10 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent z-0"></div>
        
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center text-center relative z-10 group"
          >
            <div className="w-20 h-20 rounded-full bg-white border-2 border-[#c5a059] text-[#2d0101] flex items-center justify-center text-2xl font-black mb-8 shadow-xl group-hover:bg-[#2d0101] group-hover:text-white group-hover:scale-110 transition-all duration-500">
              {index + 1}
            </div>
            <h3 className="text-xl font-black mb-4 text-[#2d0101]">{step.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-bold">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProcessSection;
