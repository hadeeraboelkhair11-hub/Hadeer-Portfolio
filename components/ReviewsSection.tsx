
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../App';

interface ReviewsSectionProps {
  lang: Language;
}

// Fixed TS errors for motion props by casting motion elements.
const MotionSpan = motion.span as any;
const MotionH2 = motion.h2 as any;
const MotionDiv = motion.div as any;

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ lang }) => {
  const translations = {
    ar: {
      tag: 'شركاء النجاح',
      title: 'آراء أعتز بها',
      reviews: [
        { 
          name: 'عبدالله السعدي', 
          location: 'سلطنة عُمان',
          text: 'شغل فخم واحترافي جداً. هدير فاهمة السوق الخليجي كويس وقدرت تطلع المتجر والفيديوهات بشكل عالمي.',
          rating: 5 
        },
        { 
          name: 'نورة الفايز', 
          location: 'المملكة العربية السعودية',
          text: 'سرعة في التنفيذ وذوق فني عالي. فيديوهات الـ AI اللي سويناها للمنتجات جابت تفاعل غير طبيعي.',
          rating: 5 
        },
        { 
          name: 'خالد المنصوري', 
          location: 'الإمارات العربية المتحدة',
          text: 'تعامل راقي جداً. الخبرة واضحة في كل لمسة تصميم، أنصح بالتعامل معها لأي مشروع يبحث عن التميز.',
          rating: 5 
        }
      ]
    },
    en: {
      tag: 'Success Partners',
      title: 'Testimonials',
      reviews: [
        { 
          name: 'Abdullah Al-Saadi', 
          location: 'Oman',
          text: 'Luxurious and professional work. Hadeer understands the Gulf market well and delivered global quality.',
          rating: 5 
        },
        { 
          name: 'Noura Al-Fayez', 
          location: 'Saudi Arabia',
          text: 'High speed and artistic taste. The AI product videos we made got incredible engagement.',
          rating: 5 
        },
        { 
          name: 'Khalid Al-Mansouri', 
          location: 'UAE',
          text: 'Very professional handling. Experience is clear in every touch. Highly recommended for excellence.',
          rating: 5 
        }
      ]
    }
  };

  const content = translations[lang];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <MotionSpan 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[#c5a059] font-black text-xs tracking-widest mb-4 block"
        >
          {content.tag}
        </MotionSpan>
        <MotionH2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-white"
        >
          {content.title}
        </MotionH2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {content.reviews.map((review, index) => (
          <MotionDiv 
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#1a0101] p-12 rounded-[50px] border border-[#c5a059]/20 catchy-shadow relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl group-hover:opacity-10 transition-opacity">"</div>
            <div className="flex gap-1 mb-8">
              {[...Array(review.rating)].map((_, i) => (
                <span key={i} className="text-[#c5a059] text-lg">★</span>
              ))}
            </div>
            <p className="text-slate-200 text-xl leading-relaxed mb-10 font-medium italic relative z-10">"{review.text}"</p>
            <div className="flex items-center gap-5 border-t border-white/5 pt-8">
              <div className="w-14 h-14 bg-[#c5a059] rounded-2xl flex items-center justify-center text-[#2d0101] font-black text-xl shadow-lg">
                {review.name[0]}
              </div>
              <div>
                <h4 className="font-black text-white text-lg">{review.name}</h4>
                <p className="text-[10px] text-[#c5a059] font-black uppercase tracking-[0.2em]">{review.location}</p>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
