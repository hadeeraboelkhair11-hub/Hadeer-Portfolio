import React, { useEffect, useState } from 'react';

const EVENT = new Date('2026-12-18T19:30:00+04:00').getTime();

const WeddingInviteDemo: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState({d:0,h:0,m:0,s:0});
  const [rsvp, setRsvp] = useState(false);
  useEffect(() => { const tick=()=>{const x=Math.max(0,EVENT-Date.now()); setLeft({d:Math.floor(x/86400000),h:Math.floor(x/3600000)%24,m:Math.floor(x/60000)%60,s:Math.floor(x/1000)%60})}; tick(); const i=setInterval(tick,1000); return()=>clearInterval(i)},[]);
  return <div dir="rtl" className="min-h-screen bg-[#f5eee5] text-[#3b1718] overflow-x-hidden" style={{fontFamily:'Georgia, serif'}}>
    {!open ? <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,#6b1b22_0%,#25070b_72%)]">
      <button onClick={()=>setOpen(true)} className="group relative w-full max-w-sm aspect-[4/5] bg-[#efe2cf] shadow-2xl border border-[#c8a36a]/50 transition-transform duration-700 hover:scale-[1.02]">
        <div className="absolute inset-4 border border-[#9c773d]/45"/><div className="absolute inset-7 border border-[#9c773d]/20"/>
        <div className="absolute top-16 left-0 right-0 text-center tracking-[.35em] text-xs text-[#76552e]">WEDDING INVITATION</div>
        <div className="absolute inset-0 flex items-center justify-center"><div className="w-24 h-24 rounded-full bg-[#741d27] shadow-xl border-4 border-[#8f3440] flex items-center justify-center text-[#e4c285] text-3xl">م ♡ س</div></div>
        <div className="absolute bottom-16 left-0 right-0 text-center"><div className="text-sm mb-2">اضغط لفتح الدعوة</div><div className="text-[10px] tracking-[.25em] opacity-60">TAP TO OPEN</div></div>
      </button>
    </div> : null}
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-[radial-gradient(circle_at_top,#fffaf2,#efe2d2)]">
      <div className="text-center max-w-xl"><div className="text-[#a27a3d] text-sm tracking-[.35em] mb-8">بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيم</div><p className="text-sm opacity-70 mb-5">بكل الحب والفرح ندعوكم لمشاركتنا ليلة العمر</p><h1 className="text-6xl md:text-8xl leading-tight text-[#671a22]">مريم <span className="text-[#b68a49]">&</span> سيف</h1><div className="w-24 h-px bg-[#b68a49] mx-auto my-8"/><p className="text-xl">الجمعة، 18 ديسمبر 2026</p><p className="mt-2 opacity-70">مسقط، سلطنة عُمان</p><div className="grid grid-cols-4 gap-2 mt-12">{[['يوم',left.d],['ساعة',left.h],['دقيقة',left.m],['ثانية',left.s]].map(([l,v])=><div className="border border-[#b68a49]/40 bg-white/45 py-4" key={String(l)}><div className="text-2xl">{v}</div><div className="text-xs opacity-60 mt-1">{l}</div></div>)}</div></div>
    </section>
    <section className="py-24 px-6 bg-[#5b151d] text-[#fff8ed] text-center"><div className="max-w-xl mx-auto"><div className="text-[#d5b276] text-xs tracking-[.3em] mb-5">THE CELEBRATION</div><h2 className="text-4xl mb-8">ليلة تجمعنا بمن نحب</h2><p className="leading-8 opacity-80">يسعدنا حضوركم ومشاركتكم فرحتنا في حفل زفافنا، فوجودكم يجعل ليلتنا أجمل.</p></div></section>
    <section className="py-24 px-6 text-center"><div className="max-w-xl mx-auto"><h2 className="text-4xl text-[#671a22] mb-10">تفاصيل الحفل</h2><div className="bg-white/60 border border-[#b68a49]/30 p-8 shadow-sm"><p className="text-[#a27a3d] text-sm mb-3">FRIDAY • 18 DECEMBER</p><h3 className="text-2xl mb-3">قاعة قصر البستان</h3><p className="opacity-70 mb-8">الاستقبال 7:30 مساءً • الحفل 8:00 مساءً</p><a href="https://maps.google.com/?q=Al+Bustan+Palace+Muscat" target="_blank" rel="noreferrer" className="inline-block px-7 py-3 border border-[#7a2028] text-[#7a2028]">عرض الموقع على الخريطة</a></div></div></section>
    <section className="py-24 px-6 bg-[#eee0cf] text-center"><div className="max-w-md mx-auto"><h2 className="text-4xl mb-5">هل ستشاركونا الفرحة؟</h2><p className="opacity-70 mb-8">يسعدنا تأكيد حضوركم قبل 5 ديسمبر</p>{!rsvp?<button onClick={()=>setRsvp(true)} className="bg-[#671a22] text-white px-10 py-4">تأكيد الحضور</button>:<div className="bg-white/70 border border-[#b68a49]/30 p-6">تم تسجيل حضوركم التجريبي ♡<br/><span className="text-xs opacity-60">RSVP DEMO</span></div>}</div></section>
    <footer className="py-12 text-center bg-[#2b090d] text-[#d8b97c]"><div className="text-2xl mb-2">مريم ♡ سيف</div><div className="text-[10px] tracking-[.3em] opacity-60">18 • 12 • 2026</div></footer>
  </div>
}
export default WeddingInviteDemo;
