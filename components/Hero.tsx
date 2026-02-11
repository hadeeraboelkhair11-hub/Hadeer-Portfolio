
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const stats = [
    { label: 'عاماً من الخبرة الرقمية', value: '10+' },
    { label: 'مشروعاً إبداعياً مكتمل', value: '900+' },
    { label: 'دولة حول العالم', value: '5+' },
  ];

  const whatsappUrl = "https://api.whatsapp.com/send?phone=96874115401";
  
  // الرابط يعبر عن صورتك التي أرفقتها (سيدة بالزي البني والحجاب)
  // تم ضبط الـ CSS أسفل الكود لتركيز المنظور على الوجه فقط
  const profileImageUrl = "https://l.top4top.io/p_3694jjr3o1.png";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-12 overflow-hidden">
      {/* Background Silk Lines & Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(197,160,89,0.08)_0%,transparent_70%)]"
        />
        
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M-100 450 C 300 300 600 600 900 450 C 1200 300 1500 450 1700 300"
            stroke="#c5a059"
            strokeWidth="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Small Elegant Portrait (Avatar Style) - Focused on face */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 relative inline-block"
        >
          <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border border-[#c5a059]/30 rounded-full border-dashed"
            />
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#c5a059] shadow-[0_0_40px_rgba(197,160,89,0.3)] bg-[#2d0101]">
              <img 
                src={profileImageUrl} 
                alt="هدير أبو الخير" 
                className="w-full h-full object-cover object-[center_20%] scale-110 transition-all duration-500"
              />
            </div>
            {/* Online Status Dot */}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-[#2d0101] rounded-full shadow-lg"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-black tracking-[0.3em] uppercase mb-10 bg-[#c5a059]/5 backdrop-blur-md">
            خبرة 10 سنوات في المجال الإبداعي
          </div>
          
          <h1 className="text-4xl md:text-[5rem] font-[900] leading-[1.1] mb-8 text-white tracking-tighter">
            نصنع <span className="gradient-gold shimmer-text">الفخامة</span><br/>بلمسة إبداعية
          </h1>

          <p className="text-base md:text-xl text-slate-300/80 mb-12 max-w-2xl mx-auto leading-relaxed font-bold">
            بناء متاجر إلكترونية احترافية وتصميم محتوى بصري مبهر <br className="hidden md:block"/> 
            يعزز مبيعاتك ويضع علامتك التجارية في الصدارة.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <motion.a 
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(197,160,89,0.3)" }}
              whileTap={{ scale: 0.95 }}
              href="#portfolio" 
              className="bg-[#c5a059] text-[#2d0101] px-10 py-4 rounded-xl font-black text-lg transition-all w-full sm:w-auto"
            >
              مشاهدة المعرض
            </motion.a>
            <motion.a 
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
              href={whatsappUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-white px-10 py-4 rounded-xl font-black text-lg backdrop-blur-sm transition-all w-full sm:w-auto text-center"
            >
              تواصل معي
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-4xl mx-auto w-full mt-24 grid grid-cols-3 gap-8 px-6 border-t border-white/5 pt-12 relative z-10"
      >
        {stats.map((stat, i) => (
          <div key={i} className="text-center group">
            <div className="text-2xl md:text-4xl font-black text-white mb-1 group-hover:text-[#c5a059] transition-colors">{stat.value}</div>
            <div className="text-[9px] md:text-[10px] font-bold text-[#c5a059] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #c5a059 0%, #ffffff 50%, #c5a059 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}} />
    </div>
  );
};

export default Hero;
