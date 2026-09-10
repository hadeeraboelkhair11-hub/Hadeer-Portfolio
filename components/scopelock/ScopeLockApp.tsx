import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BadgeCheck, BarChart3, Check, ChevronRight,
  CircleDollarSign, Clock3, FileCheck2, FileText, Globe2, LayoutDashboard,
  LockKeyhole, Menu, MessageSquareText, Plus, Search, ShieldCheck,
  Sparkles, UploadCloud, Users, X, Zap
} from 'lucide-react';

type Lang = 'ar' | 'en';
type View = 'landing' | 'dashboard' | 'new-project' | 'project';

interface Props { initialPath: string }

const sampleProjects = [
  { id: 1, name: 'Brand Identity — Luma', client: 'Luma Studio', health: 82, requests: 4, protected: 310, status: 'Active' },
  { id: 2, name: 'E-commerce Website', client: 'Noura Home', health: 64, requests: 7, protected: 540, status: 'Review' },
  { id: 3, name: 'Social Media — September', client: 'Bloom Café', health: 91, requests: 2, protected: 120, status: 'Active' },
];

const copy = {
  ar: {
    login: 'تسجيل الدخول', start: 'ابدأ مجانًا', nav: ['كيف يعمل؟', 'المميزات', 'الأسعار', 'الأسئلة الشائعة'],
    eyebrow: 'اتفاق واضح. شغل مدفوع. وقت محمي.', titleA: 'متعملش شغل', titleB: 'إضافي ببلاش.',
    subtitle: 'ScopeLock يفهم اتفاقك، ويفحص طلب العميل الجديد، ويحوّل العمل الإضافي إلى طلب واضح بالتكلفة والوقت قبل أن تبدأ.',
    noCard: '5 مشاريع كل شهر مجانًا — بدون بطاقة بنكية', see: 'شاهد كيف يعمل',
  },
  en: {
    login: 'Log in', start: 'Start free', nav: ['How it works', 'Features', 'Pricing', 'FAQ'],
    eyebrow: 'Clear scope. Paid work. Protected time.', titleA: 'Stop doing', titleB: 'unpaid work.',
    subtitle: 'ScopeLock reads your agreement, checks every new client request, and turns extra work into an approved change request before you begin.',
    noCard: '5 projects every month — no credit card required', see: 'See how it works',
  }
};

export default function ScopeLockApp({ initialPath }: Props) {
  const [lang, setLang] = useState<Lang>('ar');
  const [view, setView] = useState<View>(initialPath.includes('/app') ? 'dashboard' : 'landing');
  const [menu, setMenu] = useState(false);
  const [request, setRequest] = useState('ممكن نضيف كمان Presentation من 10 صفحات بنفس الهوية؟');
  const [analyzed, setAnalyzed] = useState(true);
  const t = copy[lang];
  const rtl = lang === 'ar';

  const go = (next: View) => {
    setView(next);
    const url = next === 'landing' ? '/scopelock' : '/scopelock/app';
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view !== 'landing') return <ProductApp lang={lang} setLang={setLang} view={view} setView={setView} />;

  return (
    <div className="sl" dir={rtl ? 'rtl' : 'ltr'}>
      <header className="sl-nav">
        <button className="sl-brand" onClick={() => go('landing')} aria-label="ScopeLock home">
          <span className="sl-logo"><LockKeyhole size={20}/></span><span>Scope<span>Lock</span></span>
        </button>
        <nav className={menu ? 'open' : ''}>
          <a href="#how">{t.nav[0]}</a><a href="#features">{t.nav[1]}</a><a href="#pricing">{t.nav[2]}</a><a href="#faq">{t.nav[3]}</a>
        </nav>
        <div className="sl-actions">
          <button className="sl-lang" onClick={() => setLang(rtl ? 'en' : 'ar')}><Globe2 size={17}/>{rtl ? 'EN' : 'عربي'}</button>
          <button className="sl-login" onClick={() => go('dashboard')}>{t.login}</button>
          <button className="sl-btn small" onClick={() => go('dashboard')}>{t.start}</button>
          <button className="sl-menu" onClick={() => setMenu(!menu)} aria-label="menu">{menu ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <main>
        <section className="sl-hero">
          <div className="sl-orb one"/><div className="sl-orb two"/>
          <div className="sl-hero-copy">
            <div className="sl-pill"><Sparkles size={15}/>{t.eyebrow}</div>
            <h1>{t.titleA}<br/><em>{t.titleB}</em></h1>
            <p>{t.subtitle}</p>
            <div className="sl-hero-actions">
              <button className="sl-btn" onClick={() => go('dashboard')}>{t.start}{rtl ? <ArrowLeft/> : <ArrowRight/>}</button>
              <a className="sl-ghost" href="#how"><span className="sl-play">▶</span>{t.see}</a>
            </div>
            <div className="sl-note"><Check size={15}/>{t.noCard}</div>
          </div>

          <div className="sl-demo-card">
            <div className="sl-window-head"><span/><span/><span/><b>Request Check</b></div>
            <div className="sl-scope-line"><FileCheck2/><div><small>ORIGINAL SCOPE</small><strong>Logo Design + Brand Guidelines</strong></div><BadgeCheck/></div>
            <div className="sl-message"><div className="sl-avatar">CL</div><div><small>Client message</small><p>“Can you also design a 10-slide presentation?”</p></div></div>
            <div className="sl-result">
              <div className="sl-result-title"><span className="sl-red-dot"/>OUT OF SCOPE <b>96% confidence</b></div>
              <p>Presentation design is not included in the original agreement.</p>
              <div className="sl-impact"><div><small>Suggested extra</small><strong>+$75</strong></div><div><small>Timeline impact</small><strong>+2 days</strong></div></div>
              <button onClick={() => go('dashboard')}>Create Change Request <ArrowRight size={16}/></button>
            </div>
            <div className="sl-protected"><ShieldCheck/><span>Revenue protected</span><strong>+$75</strong></div>
          </div>
        </section>

        <section className="sl-trust"><span>Built for independent professionals and service teams</span><div>{['DESIGNERS','AGENCIES','DEVELOPERS','MARKETERS','CONSULTANTS'].map(x=><b key={x}>{x}</b>)}</div></section>

        <section id="how" className="sl-section sl-how">
          <div className="sl-section-head"><span>HOW IT WORKS</span><h2>{rtl ? 'من رسالة عميل إلى شغل مدفوع.' : 'From client message to paid work.'}</h2><p>{rtl ? 'ثلاث خطوات واضحة تحمي الاتفاق والعلاقة مع العميل.' : 'Three clear steps that protect your scope and client relationship.'}</p></div>
          <div className="sl-steps">
            <Step n="01" icon={<FileText/>} title={rtl?'أضف الاتفاق الأصلي':'Add your original agreement'} text={rtl?'ارفع العرض أو العقد أو الصق محادثة الواتساب. ScopeLock يرتّب البنود تلقائيًا.':'Upload a proposal or contract, or paste the conversation. ScopeLock structures every term.'}/>
            <Step n="02" icon={<MessageSquareText/>} title={rtl?'افحص الطلب الجديد':'Check the new request'} text={rtl?'الصق الرسالة أو ارفع Screenshot واعرف فورًا هل الطلب داخل الاتفاق أم إضافي.':'Paste the message or upload a screenshot to see whether it is included or extra.'}/>
            <Step n="03" icon={<CircleDollarSign/>} title={rtl?'حوّله إلى طلب رسمي':'Turn it into a change request'} text={rtl?'حدّد التكلفة والمدة، وأرسل رابطًا للعميل للموافقة قبل بدء التنفيذ.':'Set cost and timing, then send a client approval link before starting.'}/>
          </div>
        </section>

        <section id="features" className="sl-section sl-workbench">
          <div className="sl-section-head left"><span>TRY IT</span><h2>{rtl?'اختبر طلب العميل الآن':'Check a client request now'}</h2><p>{rtl?'مثال تفاعلي يوضح النتيجة التي ستحصل عليها داخل مشروعك.':'A live example of the result you receive inside every project.'}</p></div>
          <div className="sl-checker">
            <div className="sl-check-input"><label>{rtl?'رسالة العميل الجديدة':'New client message'}</label><textarea value={request} onChange={e=>{setRequest(e.target.value);setAnalyzed(false)}}/><div className="sl-upload-row"><button><UploadCloud/> {rtl?'ارفع Screenshot':'Upload screenshot'}</button><button className="sl-btn" onClick={()=>setAnalyzed(true)}><Sparkles/> {rtl?'فحص الطلب':'Check request'}</button></div></div>
            <div className={`sl-check-output ${analyzed?'ready':''}`}>
              {analyzed ? <><div className="sl-result-title"><span className="sl-red-dot"/>{rtl?'خارج نطاق الاتفاق':'OUT OF SCOPE'} <b>96%</b></div><h3>{rtl?'Presentation Design غير موجود ضمن الاتفاق الأصلي.':'Presentation design is not included in the original scope.'}</h3><blockquote>“Logo Design + Brand Guidelines”</blockquote><div className="sl-impact"><div><small>{rtl?'السعر المقترح':'Suggested extra'}</small><strong>$75</strong></div><div><small>{rtl?'وقت إضافي':'Extra time'}</small><strong>{rtl?'يومان':'2 days'}</strong></div></div></> : <div className="sl-empty"><Search/><p>{rtl?'اضغطي فحص الطلب لعرض التحليل':'Run the check to see the analysis'}</p></div>}
            </div>
          </div>
        </section>

        <section className="sl-section sl-features">
          <div className="sl-section-head"><span>EVERYTHING CONNECTED</span><h2>{rtl?'مش مجرد حكم. دورة عمل كاملة.':'Not just a verdict. A complete workflow.'}</h2></div>
          <div className="sl-feature-grid">
            <Feature icon={<Sparkles/>} title={rtl?'تحليل مدعوم بالدليل':'Evidence-based AI'} text={rtl?'كل نتيجة مرتبطة بالبند الأصلي مع نسبة ثقة واضحة.':'Every result cites the original term and includes a confidence score.'}/>
            <Feature icon={<Clock3/>} title={rtl?'تأثير الموعد':'Deadline impact'} text={rtl?'اعرف الوقت الإضافي وحدّث موعد التسليم قبل الموافقة.':'Estimate extra time and update delivery before approval.'}/>
            <Feature icon={<FileCheck2/>} title={rtl?'موافقة موثقة':'Client approval'} text={rtl?'رابط بسيط للموافقة أو الرفض، بدون إنشاء حساب للعميل.':'A simple approve-or-decline link, with no client account needed.'}/>
            <Feature icon={<BarChart3/>} title={rtl?'الإيراد المحمي':'Revenue protected'} text={rtl?'شاهد قيمة العمل الإضافي المكتشف والموافق عليه بوضوح.':'Track detected, approved, pending, and protected revenue.'}/>
            <Feature icon={<Users/>} title={rtl?'مخاطر العملاء':'Client risk profiles'} text={rtl?'تعرف على العملاء الأكثر طلبًا لتعديلات خارج الاتفاق.':'Spot clients who repeatedly request work beyond scope.'}/>
            <Feature icon={<Zap/>} title="ScopeGuard AI" text={rtl?'اسأله عن أي قرار أو اطلب ردًا مهذبًا جاهزًا للعميل.':'Ask why, price the request, or draft a ready-to-send client reply.'}/>
          </div>
        </section>

        <section id="pricing" className="sl-section sl-pricing">
          <div className="sl-section-head"><span>PRICING</span><h2>{rtl?'ابدأ مجانًا. ادفع عندما يكبر شغلك.':'Start free. Upgrade when your work grows.'}</h2></div>
          <div className="sl-price-grid">
            <Price name="Free" price="$0" sub={rtl?'للعمل المستقل في البداية':'For getting started'} features={rtl?['5 مشاريع كل شهر','تحليل الاتفاق الأساسي','فحص النصوص والصور','طلبات التغيير وموافقة العميل']:['5 projects every month','Basic scope analysis','Text and screenshot checks','Change requests and client approval']} cta={t.start}/>
            <Price pro name="Pro" price="$9" sub={rtl?'شهريًا — بدون التزام سنوي':'per month — cancel anytime'} features={rtl?['حتى 100 مشروع','فحوصات غير محدودة','تسعير ذكي وتحليل متقدم','Voice Notes وProposal Checker','Analytics وScopeGuard AI']:['Up to 100 projects','Unlimited request checks','Smart pricing and advanced AI','Voice notes and proposal checker','Analytics and ScopeGuard AI']} cta={rtl?'ابدأ Pro':'Start Pro'}/>
          </div>
        </section>

        <section id="faq" className="sl-final"><LockKeyhole/><h2>{rtl?'خلي كل طلب إضافي واضحًا ومدفوعًا.':'Make every extra request clear and paid.'}</h2><p>{rtl?'ابدأ بخمسة مشاريع مجانية كل شهر.':'Start with five free projects every month.'}</p><button className="sl-btn" onClick={() => go('dashboard')}>{t.start}{rtl?<ArrowLeft/>:<ArrowRight/>}</button></section>
      </main>
      <footer className="sl-footer"><div className="sl-brand"><span className="sl-logo"><LockKeyhole size={18}/></span><span>Scope<span>Lock</span></span></div><p>© 2026 ScopeLock. Built by Hadeer Abo Elkhair.</p><button onClick={()=>setLang(rtl?'en':'ar')}><Globe2/> {rtl?'English':'العربية'}</button></footer>
    </div>
  );
}

function Step({n,icon,title,text}:{n:string,icon:React.ReactNode,title:string,text:string}){return <article className="sl-step"><span>{n}</span><div className="sl-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>}
function Feature({icon,title,text}:{icon:React.ReactNode,title:string,text:string}){return <article className="sl-feature"><div className="sl-icon">{icon}</div><h3>{title}</h3><p>{text}</p><ChevronRight/></article>}
function Price({name,price,sub,features,cta,pro=false}:{name:string,price:string,sub:string,features:string[],cta:string,pro?:boolean}){return <article className={`sl-price ${pro?'pro':''}`}>{pro&&<span className="sl-popular">MOST POPULAR</span>}<h3>{name}</h3><div className="sl-price-number">{price}<small>{price!=='$0'&&'/mo'}</small></div><p>{sub}</p><ul>{features.map(f=><li key={f}><Check/>{f}</li>)}</ul><button className={pro?'sl-btn':'sl-price-btn'}>{cta}</button></article>}

function ProductApp({lang,setLang,view,setView}:{lang:Lang,setLang:(l:Lang)=>void,view:View,setView:(v:View)=>void}){
  const rtl=lang==='ar';
  const [projects,setProjects]=useState(sampleProjects);
  const [query,setQuery]=useState('');
  const [form,setForm]=useState({name:'',client:'',service:'Brand Identity',currency:'USD',price:'',deadline:''});
  const filtered=useMemo(()=>projects.filter(p=>(p.name+p.client).toLowerCase().includes(query.toLowerCase())),[projects,query]);
  const nav=(v:View)=>{setView(v);window.scrollTo(0,0)};
  const addProject=(e:React.FormEvent)=>{e.preventDefault();if(!form.name||!form.client)return;setProjects([{id:Date.now(),name:form.name,client:form.client,health:70,requests:0,protected:0,status:'Draft'},...projects]);nav('dashboard')};

  return <div className="sl-app" dir={rtl?'rtl':'ltr'}>
    <aside><button className="sl-brand" onClick={()=>{window.history.pushState({},'','/scopelock');setView('landing')}}><span className="sl-logo"><LockKeyhole size={19}/></span><span>Scope<span>Lock</span></span></button><nav><button className={view==='dashboard'?'active':''} onClick={()=>nav('dashboard')}><LayoutDashboard/> {rtl?'الرئيسية':'Dashboard'}</button><button className={view==='new-project'?'active':''} onClick={()=>nav('new-project')}><Plus/> {rtl?'مشروع جديد':'New project'}</button><button><MessageSquareText/> {rtl?'طلبات العملاء':'Client requests'} <i>6</i></button><button><FileCheck2/> {rtl?'الموافقات':'Approvals'} <i>3</i></button><button><BarChart3/> {rtl?'الإيراد المحمي':'Protected revenue'}</button></nav><div className="sl-upgrade"><Zap/><strong>ScopeLock Pro</strong><p>{rtl?'افتح التحليل المتقدم والفحوصات غير المحدودة.':'Unlock advanced AI and unlimited checks.'}</p><button>{rtl?'الترقية — $9':'Upgrade — $9'}</button></div><button className="sl-user"><span>HA</span><div><strong>Hadeer</strong><small>Free plan</small></div></button></aside>
    <main><header><div><h1>{view==='new-project'?(rtl?'إنشاء مشروع جديد':'Create a new project'):(rtl?'أهلًا هدير 👋':'Welcome back, Hadeer 👋')}</h1><p>{view==='new-project'?(rtl?'أضيفي تفاصيل الاتفاق الأساسي أولًا.':'Start with the original project details.'):(rtl?'دي نظرة سريعة على شغلك المحمي هذا الشهر.':'Here’s what ScopeLock protected this month.')}</p></div><div><button className="sl-lang" onClick={()=>setLang(rtl?'en':'ar')}><Globe2/>{rtl?'EN':'عربي'}</button>{view!=='new-project'&&<button className="sl-btn small" onClick={()=>nav('new-project')}><Plus/>{rtl?'مشروع جديد':'New project'}</button>}</div></header>
      {view==='new-project'?<form className="sl-project-form" onSubmit={addProject}><div className="sl-form-head"><span>1</span><div><h2>{rtl?'تفاصيل المشروع':'Project details'}</h2><p>{rtl?'المعلومات الأساسية التي سيستخدمها ScopeLock في التحليل والتسعير.':'Used for scope analysis, pricing, and timeline impact.'}</p></div></div><div className="sl-form-grid"><label>{rtl?'اسم المشروع':'Project name'}<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder={rtl?'مثال: هوية بصرية لمتجر':'e.g. Luma brand identity'}/></label><label>{rtl?'اسم العميل':'Client name'}<input value={form.client} onChange={e=>setForm({...form,client:e.target.value})}/></label><label>{rtl?'نوع الخدمة':'Service type'}<select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}><option>Brand Identity</option><option>Social Media</option><option>Website Design</option><option>Video Editing</option></select></label><label>{rtl?'العملة':'Currency'}<select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}>{['USD','OMR','EGP','SAR','AED','KWD','QAR','BHD','EUR','GBP'].map(c=><option key={c}>{c}</option>)}</select></label><label>{rtl?'سعر المشروع الأصلي':'Original project price'}<input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>{rtl?'موعد التسليم':'Delivery date'}<input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}/></label></div><div className="sl-scope-upload"><UploadCloud/><h3>{rtl?'أضيفي الاتفاق الأصلي':'Add the original agreement'}</h3><p>{rtl?'PDF أو DOCX أو Screenshot، أو الصقي نص الاتفاق.':'PDF, DOCX, screenshot, or paste the agreement text.'}</p><button type="button">{rtl?'اختيار ملف':'Choose file'}</button><textarea placeholder={rtl?'أو الصقي نص الاتفاق هنا…':'Or paste the agreement here…'}/></div><div className="sl-form-actions"><button type="button" onClick={()=>nav('dashboard')}>{rtl?'إلغاء':'Cancel'}</button><button className="sl-btn" type="submit">{rtl?'حفظ وتحليل الاتفاق':'Save & analyze scope'}<Sparkles/></button></div></form>:<Dashboard rtl={rtl} projects={filtered} query={query} setQuery={setQuery} nav={nav}/>} 
    </main>
  </div>
}

function Dashboard({rtl,projects,query,setQuery,nav}:{rtl:boolean,projects:typeof sampleProjects,query:string,setQuery:(s:string)=>void,nav:(v:View)=>void}){return <><section className="sl-planbar"><div><span>{rtl?'الخطة المجانية':'FREE PLAN'}</span><strong>{rtl?'متبقي 3 من 5 مشاريع هذا الشهر':'3 of 5 projects remaining this month'}</strong></div><div className="sl-progress"><i/></div><button>{rtl?'عرض Pro':'View Pro'}</button></section><section className="sl-stats"><Stat icon={<FileText/>} label={rtl?'المشاريع النشطة':'Active projects'} value="3" note={rtl?'من أصل 5 مجانية':'of 5 free'}/><Stat icon={<MessageSquareText/>} label={rtl?'طلبات إضافية':'Extra requests'} value="13" note={rtl?'+4 هذا الشهر':'+4 this month'}/><Stat icon={<CircleDollarSign/>} label={rtl?'الإيراد المحمي':'Revenue protected'} value="$970" note={rtl?'تمت الموافقة على $620':'$620 approved'}/><Stat icon={<Clock3/>} label={rtl?'بانتظار الموافقة':'Pending approvals'} value="3" note="$350"/></section><section className="sl-revenue-card"><div><span>{rtl?'إجمالي الإيراد المحمي':'LIFETIME REVENUE PROTECTED'}</span><h2>$4,280</h2><p>{rtl?'قيمة العمل الإضافي الذي ساعدك ScopeLock على اكتشافه وتوثيقه.':'Extra work ScopeLock helped you detect, document, and charge for.'}</p></div><div className="sl-mini-chart">{[35,54,42,68,51,77,84,72,95].map((h,i)=><i key={i} style={{height:`${h}%`}}/> )}</div></section><section className="sl-projects"><div className="sl-table-head"><div><h2>{rtl?'المشاريع':'Projects'}</h2><p>{rtl?'كل اتفاقاتك وطلبات عملائك في مكان واحد.':'Every scope and client request in one place.'}</p></div><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={rtl?'بحث…':'Search projects…'}/></label></div><div className="sl-table"><div className="sl-tr sl-th"><span>{rtl?'المشروع والعميل':'Project & client'}</span><span>{rtl?'صحة الاتفاق':'Scope health'}</span><span>{rtl?'الطلبات':'Requests'}</span><span>{rtl?'الإيراد المحمي':'Protected'}</span><span>{rtl?'الحالة':'Status'}</span></div>{projects.map(p=><button className="sl-tr" key={p.id} onClick={()=>nav('project')}><span><strong>{p.name}</strong><small>{p.client}</small></span><span><b className={p.health<70?'warn':''}>{p.health}</b>/100</span><span>{p.requests}</span><span className="money">${p.protected}</span><span><em className={p.status==='Active'?'active':''}>{p.status}</em><ChevronRight/></span></button>)}</div></section></>}
function Stat({icon,label,value,note}:{icon:React.ReactNode,label:string,value:string,note:string}){return <article className="sl-stat"><div className="sl-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{note}</small></article>}
