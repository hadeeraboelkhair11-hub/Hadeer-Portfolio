
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Language } from '../App';

interface ContactFormProps {
  lang: Language;
}

// Fixed TS errors for motion props by casting motion elements.
const MotionDiv = motion.div as any;
const MotionA = motion.a as any;

const ContactForm: React.FC<ContactFormProps> = ({ lang }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const whatsappUrl = "https://api.whatsapp.com/send?phone=96874115401";

  const translations = {
    ar: {
      title: <>لنصنع <br/><span className="text-[#c5a059]">التميز معاً</span></>,
      desc: 'المجال متاح حالياً للمشاريع الجديدة والاستشارات الإبداعية. اختر الجودة والخبرة.',
      emailLabel: 'البريد الإلكتروني',
      whatsappLabel: 'واتساب مباشر',
      successTitle: 'شكراً لثقتك!',
      successDesc: 'تم استلام طلبك، وسأقوم بالرد عليك شخصياً في أقرب وقت.',
      nameLabel: 'الاسم الكامل',
      namePlaceholder: 'اكتب اسمك هنا',
      projectLabel: 'نوع المشروع',
      projectOptions: [
        'بناء متجر إلكتروني متكامل',
        'موقع تعريفي للشركة',
        'حملة إعلانية فيديو وصور (AI)',
        'تصميم هوية بصرية (Branding)',
        'استشارة إبداعية'
      ],
      detailsLabel: 'تفاصيل الفكرة',
      detailsPlaceholder: 'اكتب تفاصيل مشروعك...',
      submitBtn: 'إرسال الطلب الآن',
      sendingBtn: 'جاري الإرسال...'
    },
    en: {
      title: <>Let's Create <br/><span className="text-[#c5a059]">Excellence Together</span></>,
      desc: 'Availability is open for new projects and creative consultations. Choose quality and experience.',
      emailLabel: 'Email Address',
      whatsappLabel: 'Direct WhatsApp',
      successTitle: 'Thank You!',
      successDesc: 'Your request has been received, and I will get back to you personally soon.',
      nameLabel: 'Full Name',
      namePlaceholder: 'Write your name here',
      projectLabel: 'Project Type',
      projectOptions: [
        'E-Commerce Store Building',
        'Company Profile Website',
        'AI Video & Photo Campaign',
        'Visual Identity (Branding)',
        'Creative Consultation'
      ],
      detailsLabel: 'Idea Details',
      detailsPlaceholder: 'Write your project details...',
      submitBtn: 'Send Request Now',
      sendingBtn: 'Sending...'
    }
  };

  const content = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('success'), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
      <div className="flex-1 space-y-10 pt-4">
        <MotionDiv
          initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-[#2d0101]">
            {content.title}
          </h2>
          <p className="text-slate-500 text-xl leading-relaxed">{content.desc}</p>
        </MotionDiv>
        
        <div className="space-y-6">
          <MotionA 
            href="mailto:hadeer.aboelkhair11@gmail.com"
            whileHover={{ x: lang === 'ar' ? -10 : 10 }}
            className="flex items-center gap-6 group"
          >
            <div className="w-14 h-14 bg-[#2d0101] rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-[#c5a059]/20 text-[#c5a059]">📧</div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{content.emailLabel}</p>
              <p className="font-bold text-lg group-hover:text-[#c5a059] transition-colors text-[#2d0101]">hadeer.aboelkhair11@gmail.com</p>
            </div>
          </MotionA>
          
          <MotionA 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: lang === 'ar' ? -10 : 10 }}
            className="flex items-center gap-6 group"
          >
            <div className="w-14 h-14 bg-green-600/10 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-green-500/20 text-green-600">📱</div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{content.whatsappLabel}</p>
              <p className="font-bold text-lg group-hover:text-green-500 transition-colors text-[#2d0101]">+968 7411 5401</p>
            </div>
          </MotionA>
        </div>
      </div>

      <MotionDiv 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="flex-1 w-full max-w-xl"
      >
        <div className="bg-white p-10 rounded-[40px] border border-[#2d0101]/5 shadow-2xl relative overflow-hidden">
          {status === 'success' ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-6">✨</div>
              <h3 className="text-3xl font-black mb-4 text-[#2d0101]">{content.successTitle}</h3>
              <p className="text-slate-500">{content.successDesc}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#2d0101] mx-2 uppercase tracking-widest">{content.nameLabel}</label>
                <input required type="text" className="w-full bg-[#f9f7f2] border border-[#2d0101]/5 rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] transition-all text-[#2d0101]" placeholder={content.namePlaceholder} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#2d0101] mx-2 uppercase tracking-widest">{content.projectLabel}</label>
                <select className="w-full bg-[#f9f7f2] border border-[#2d0101]/5 rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] transition-all appearance-none text-[#2d0101]">
                  {content.projectOptions.map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#2d0101] mx-2 uppercase tracking-widest">{content.detailsLabel}</label>
                <textarea required rows={4} className="w-full bg-[#f9f7f2] border border-[#2d0101]/5 rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] transition-all resize-none text-[#2d0101]" placeholder={content.detailsPlaceholder}></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === 'sending'}
                className="w-full bg-[#2d0101] hover:bg-[#4a0404] text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-[#2d0101]/20"
              >
                {status === 'sending' ? content.sendingBtn : content.submitBtn}
              </button>
            </form>
          )}
        </div>
      </MotionDiv>
    </div>
  );
};

export default ContactForm;
