import React,{useState}from'react';

export default function WeddingInviteDemo(){
  const[open,setOpen]=useState(false);
  return <div className="min-h-screen bg-[#190407] overflow-hidden flex items-center justify-center" style={{perspective:'1600px'}}>
    <div className="relative w-[92vw] max-w-[420px] h-[82vh] max-h-[760px] bg-[#efe2ce] shadow-[0_30px_100px_rgba(0,0,0,.65)] overflow-hidden">
      <img src="/wedding-assets/card.webp" alt="Invitation" className="absolute inset-0 w-full h-full object-cover"/>
      <div className={`absolute inset-y-0 left-0 w-1/2 origin-left transition-transform duration-[1400ms] ease-[cubic-bezier(.22,.8,.22,1)] z-20 ${open?'[-webkit-transform:rotateY(-115deg)] [transform:rotateY(-115deg)]':'[transform:rotateY(0deg)]'}`} style={{transformStyle:'preserve-3d'}}>
        <img src="/wedding-assets/door-left.webp" alt="Left invitation door" className="w-full h-full object-cover"/>
      </div>
      <div className={`absolute inset-y-0 right-0 w-1/2 origin-right transition-transform duration-[1400ms] ease-[cubic-bezier(.22,.8,.22,1)] z-20 ${open?'[transform:rotateY(115deg)]':'[transform:rotateY(0deg)]'}`} style={{transformStyle:'preserve-3d'}}>
        <img src="/wedding-assets/door-right.webp" alt="Right invitation door" className="w-full h-full object-cover"/>
      </div>
      <button onClick={()=>setOpen(true)} className={`absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${open?'opacity-0 scale-75 pointer-events-none':'opacity-100 scale-100'}`} aria-label="Open invitation">
        <img src="/wedding-assets/seal.webp" alt="M S seal" className="w-28 h-28 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,.45)]"/>
      </button>
      {!open&&<div className="absolute bottom-8 inset-x-0 z-30 text-center text-[#f3d8a2] text-sm tracking-wide">اضغطي على الختم لفتح الدعوة</div>}
    </div>
  </div>
}
