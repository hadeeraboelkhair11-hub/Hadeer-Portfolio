
import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const navItems = [
    { label: 'البداية', id: 'home' },
    { label: 'الخدمات', id: 'services' },
    { label: 'المعرض', id: 'portfolio' },
    { label: 'الآراء', id: 'reviews' },
    { label: 'تواصل', id: 'contact' },
  ];

  const whatsappUrl = "https://api.whatsapp.com/send?phone=96874115401";

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-8 md:px-16 py-4 flex justify-between items-center border-b border-[#2d0101]/5"
    >
      <div className="flex flex-col group cursor-pointer">
        <span className="text-xl md:text-2xl font-black text-[#2d0101] leading-none tracking-tight">هدير أبو الخير</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-4 h-[2px] bg-[#c5a059]"></span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-black italic">Senior Creative Director</span>
        </div>
      </div>
      
      <nav className="hidden lg:flex gap-8">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`text-xs font-black uppercase tracking-widest transition-all ${
              activeSection === item.id ? 'text-[#c5a059] border-b-2 border-[#c5a059] pb-1' : 'text-slate-400 hover:text-[#2d0101]'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <motion.a 
          whileHover={{ scale: 1.05 }}
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#2d0101] text-white px-8 py-2.5 rounded-full text-xs font-black shadow-xl shadow-[#2d0101]/20"
        >
          طلب مشروع
        </motion.a>
      </div>
    </motion.header>
  );
};

export default Header;
