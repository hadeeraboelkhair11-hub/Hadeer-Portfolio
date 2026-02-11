
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PortfolioGrid: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'store' | 'ai'>('all');
  const whatsappUrl = "https://api.whatsapp.com/send?phone=96874115401";

  const projects = [
    { 
      id: 1, 
      title: 'متجر مجوهرات لؤلؤة', 
      category: 'store', 
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800', 
      desc: 'إعادة صياغة تجربة التسوق الفاخرة على منصة سلة' 
    },
    { 
      id: 2, 
      title: 'حملة عطر "سديم" AI', 
      category: 'ai', 
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800', 
      desc: 'إنتاج إعلاني متكامل بالذكاء الاصطناعي (صور وفيديو)' 
    },
    { 
      id: 3, 
      title: 'متجر أدوات القهوة المختصة', 
      category: 'store', 
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800', 
      desc: 'بناء الهوية والتواجد الرقمي المتكامل' 
    },
    { 
      id: 4, 
      title: 'بوسترات منتجات رياضية', 
      category: 'ai', 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', 
      desc: 'خلق واقع افتراضى مبهر للمنتجات عبر الـ AI' 
    },
    { 
      id: 5, 
      title: 'إعلان أزياء "فيوتشر"', 
      category: 'ai', 
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800', 
      desc: 'دمج الفن التقليدى مع الابتكار الرقمى' 
    },
    { 
      id: 6, 
      title: 'متجر مستحضرات التجميل ناتشورال', 
      category: 'store', 
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800', 
      desc: 'تصميم يركز على سهولة الاستخدام وزيادة المبيعات' 
    }
  ];

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <div>
          <span className="text-[#c5a059] font-black text-xs tracking-[0.4em] uppercase mb-4 block">Creative Portfolio</span>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">مختارات من <br/> <span className="text-[#c5a059]">أعمالي</span></h2>
        </div>
        
        <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'store', label: 'المتاجر' },
            { id: 'ai', label: 'دعاية الـ AI' }
          ].map((btn) => (
            <button 
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${
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

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div 
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
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d0101] via-[#2d0101]/30 to-transparent p-12 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                <span className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.4em] mb-3">
                  {project.category === 'ai' ? 'Digital Art & Motion' : 'Professional E-Store'}
                </span>
                <h3 className="text-3xl font-black text-white mb-3">{project.title}</h3>
                <p className="text-slate-300 text-sm mb-10 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">{project.desc}</p>
                <div className="flex gap-4">
                  <a 
                    href={whatsappUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-[#2d0101] px-10 py-4 rounded-2xl text-[10px] font-black hover:bg-[#c5a059] transition-all uppercase tracking-[0.2em]"
                  >
                    مناقشة فكرة المشروع
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PortfolioGrid;
