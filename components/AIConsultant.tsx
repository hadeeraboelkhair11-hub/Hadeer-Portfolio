
import React, { useState } from 'react';
import { getAIProjectAdvice } from '../services/geminiService';
import { motion } from 'framer-motion';

// Fixed TS errors for motion props by casting motion elements.
const MotionDiv = motion.div as any;

const AIConsultant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'يا هلا بك في استوديو هدير. هنا نبدأ برسم ملامح مشروعك القادم، مو الترتيب؟ خبرني عن فكرتك وفالك طيب.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Map existing messages to Gemini's history format for context-aware responses.
    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const aiResponse = await getAIProjectAdvice(userMsg, history);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-[#c5a059] font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Project Planning</span>
        <h2 className="text-4xl md:text-5xl font-black text-[#2d0101]">رؤية <span className="text-[#c5a059]">تخطيطية</span> لمشروعك</h2>
      </div>

      <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-[#2d0101]/5 relative">
        <div className="bg-[#2d0101] p-8 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#c5a059] rounded-2xl flex items-center justify-center text-3xl shadow-lg">🏛️</div>
            <div>
              <h3 className="font-black text-xl text-white">Creative Consultation</h3>
              <p className="text-[#c5a059] text-[10px] font-bold uppercase tracking-widest opacity-80">Hadeer Studio Expert</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="text-white/20 font-black text-4xl tracking-tighter italic uppercase">Hadeer Studio</span>
          </div>
        </div>

        <div className="h-[450px] overflow-y-auto p-8 space-y-6 bg-[#f9f7f2] marble-texture">
          {messages.map((msg, idx) => (
            <MotionDiv 
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[85%] p-6 rounded-[30px] text-sm leading-relaxed font-bold ${
                msg.role === 'user' 
                ? 'bg-[#2d0101] text-white shadow-xl rounded-tr-none' 
                : 'bg-white text-[#2d0101] shadow-xl border border-[#2d0101]/5 rounded-tl-none whitespace-pre-wrap'
              }`}>
                {msg.text}
              </div>
            </MotionDiv>
          ))}
          {isLoading && (
            <div className="flex justify-end">
              <div className="bg-white/50 backdrop-blur-md p-6 rounded-[30px] animate-pulse text-[#c5a059] text-xs font-black uppercase tracking-widest">
                نحلل مشروعك الآن...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-white border-t border-[#2d0101]/5 flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب فكرة مشروعك، حلمك، أو استفسارك هنا..."
            className="flex-1 bg-[#f9f7f2] border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-[#c5a059] text-[#2d0101] outline-none font-bold placeholder:opacity-50"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-[#2d0101] hover:bg-[#4a0404] text-white px-10 rounded-2xl font-black transition-all disabled:opacity-50 shadow-xl shadow-[#2d0101]/10 flex items-center gap-3"
          >
            <span>إرسال</span>
            <span className="text-xl">✦</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIConsultant;
