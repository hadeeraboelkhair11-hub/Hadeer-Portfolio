import React,{useState}from'react';

export default function WeddingInviteDemo(){
  const[open,setOpen]=useState(false);
  return <div className="min-h-screen bg-[#160306] overflow-hidden flex items-center justify-center px-3 py-5" style={{perspective:'1800px'}}>
    <div className="relative w-full max-w-[430px] aspect-[269/431] bg-[#efe2ce] shadow-[0_28px_90px_rgba(0,0,0,.72)] overflow-visible">
      <img src="/wedding-assets/card.webp" alt="Invitation" className="absolute inset-0 w-full h-full object-cover z-0"/>
      <div className={`absolute inset-y-0 left-0 w-1/2 origin-left z-20 transition-transform duration-[1400ms] ease-[cubic-bezier(.22,.8,.22,1)] ${open?'[transform:rotateY(-112deg)]':'[transform:rotateY(0deg)]'}`} style={{transformStyle:'preserve-3d',backfaceVisibility:'hidden'}}>
        <img src="/wedding-assets/door-left.webp" alt="Left invitation door" className="block w-full h-full object-fill"/>
      </div>
      <div className={`absolute inset-y-0 right-0 w-1/2 origin-right z-20 transition-transform duration-[1400ms] ease-[cubic-bezier(.22,.8,.22,1)] ${open?'[transform:rotateY(112deg)]':'[transform:rotateY(0deg)]'}`} style={{transformStyle:'preserve-3d',backfaceVisibility:'hidden'}}>
        <img src="/wedding-assets/door-right.webp" alt="Right invitation door" className="block w-full h-full object-fill"/>
      </div>
      <button onClick={()=>setOpen(true)} className={`absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${open?'opacity-0 scale-75 pointer-events-none':'opacity-100 scale-100'}`} aria-label="Open invitation">
        <img src="/wedding-assets/seal.webp" alt="M S seal" className="w-[26vw] max-w-[118px] min-w-[88px] h-auto object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,.48)]"/>
      </button>
      {!open&&<div className="absolute bottom-4 left-0 right-0 z-30 text-center text-[#f0d4a0] text-[12px] tracking-wide drop-shadow-[0_1px_5px_rgba(0,0,0,.9)]">اضغطي على الختم لفتح الدعوة</div>}
    </div>
  </div>
}
