
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const whatsappUrl = "https://api.whatsapp.com/send?phone=96874115401";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('success'), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
      <div className="flex-1 space-y-10 pt-4">
        <div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-[#2d0101]">
            لنصنع <br/><span className="text-[#c5a059]">التميز معاً</span>
          </h2>
          <p className="text-slate-500 text-xl leading-relaxed">المجال متاح حالياً للمشاريع الجديدة والاستشارات الإبداعية. اختر الجودة والخبرة.</p>
        </div>
        
        <div className="space-y-6">
          <motion.a 
            href="mailto:hadeer.aboelkhair11@gmail.com"
            whileHover={{ x: 10 }}
            className="flex items-center gap-6 group"
          >
            <div className="w-14 h-14 bg-[#2d0101] rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-[#c5a059]/20 text-[#c5a059]">📧</div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">البريد الإلكتروني</p>
              <p className="font-bold text-lg group-hover:text-[#c5a059] transition-colors text-[#2d0101]">hadeer.aboelkhair11@gmail.com</p>
            </div>
          </motion.a>
          
          <motion.a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 10 }}
            className="flex items-center gap-6 group"
          >
            <div className="w-14 h-14 bg-green-600/10 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-green-500/20 text-green-600">📱</div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">واتساب مباشر</p>
              <p className="font-bold text-lg group-hover:text-green-500 transition-colors text-[#2d0101]">+968 7411 5401</p>
            </div>
          </motion.a>
        </div>
      </div>

      <div className="flex-1 w-full max-w-xl">
        <div className="bg-white p-10 rounded-[40px] border border-[#2d0101]/5 shadow-2xl relative overflow-hidden">
          {status === 'success' ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-6">✨</div>
              <h3 className="text-3xl font-black mb-4 text-[#2d0101]">شكراً لثقتك!</h3>
              <p className="text-slate-500">تم استلام طلبك، وسأقوم بالرد عليك شخصياً في أقرب وقت.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#2d0101] mr-2 uppercase tracking-widest">الاسم الكامل</label>
                <input required type="text" className="w-full bg-[#f9f7f2] border border-[#2d0101]/5 rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] transition-all text-[#2d0101]" placeholder="اكتب اسمك هنا" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#2d0101] mr-2 uppercase tracking-widest">نوع المشروع</label>
                <select className="w-full bg-[#f9f7f2] border border-[#2d0101]/5 rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] transition-all appearance-none text-[#2d0101]">
                  <option>بناء متجر إلكتروني متكامل</option>
                  <option>موقع تعريفي للشركة</option>
                  <option>حملة إعلانية فيديو وصور (AI)</option>
                  <option>تصميم هوية بصرية (Branding)</option>
                  <option>استشارة إبداعية</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#2d0101] mr-2 uppercase tracking-widest">تفاصيل الفكرة</label>
                <textarea required rows={4} className="w-full bg-[#f9f7f2] border border-[#2d0101]/5 rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] transition-all resize-none text-[#2d0101]" placeholder="اكتب تفاصيل مشروعك..."></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === 'sending'}
                className="w-full bg-[#2d0101] hover:bg-[#4a0404] text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-[#2d0101]/20"
              >
                {status === 'sending' ? 'جاري الإرسال...' : 'إرسال الطلب الآن'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
