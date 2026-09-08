import React, { FormEvent, useEffect, useState } from 'react';
import { CalendarDays, Copy, Eye, Heart, ImagePlus, LayoutDashboard, Link2, MapPin, Music2, Plus, Save, Settings2, Trash2, Users } from 'lucide-react';
import { deleteInvitation, duplicateInvitation, emptyInvitation, getInvitationById, getInvitationByIdWithMedia, getInvitations, getRsvps, saveInvitation } from '../wedding/store';
import type { Invitation } from '../wedding/types';
import './WeddingDashboard.css';

const navigate = (path: string) => { window.location.assign(path); };
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const SideNav = ({ active }: { active: 'invitations' | 'rsvp' }) => (
  <aside className="wd-sidebar">
    <button className="wd-brand" onClick={() => navigate('/wedding-admin')}><span>ز</span><div>استوديو الدعوات<small>إدارة دعوات الزفاف</small></div></button>
    <nav>
      <button className={active === 'invitations' ? 'active' : ''} onClick={() => navigate('/wedding-admin')}><LayoutDashboard size={18}/> الدعوات</button>
      <button className={active === 'rsvp' ? 'active' : ''} onClick={() => navigate('/wedding-admin/rsvp')}><Users size={18}/> ردود الحضور</button>
    </nav>
    <div className="wd-template-note"><span>01</span><div><strong>رويال برجاندي</strong><small>القالب المتاح</small></div></div>
  </aside>
);

const Shell = ({ active, children }: { active: 'invitations' | 'rsvp'; children: React.ReactNode }) => <div className="wd-app" dir="rtl"><SideNav active={active}/><main className="wd-main">{children}</main></div>;

function InvitationsList() {
  const [items, setItems] = useState(getInvitations);
  const remove = async (item: Invitation) => {
    if (!window.confirm(`هل تريدين حذف دعوة ${item.brideName} و${item.groomName}؟`)) return;
    await deleteInvitation(item.id); setItems(getInvitations());
  };
  const duplicate = async (item: Invitation) => { const copy = await duplicateInvitation(item); await saveInvitation(copy); setItems(getInvitations()); };
  return <Shell active="invitations">
    <header className="wd-page-head"><div><p>دعوات الزفاف</p><h1>الدعوات</h1><span>أنشئي الدعوات وعدّليها وانشريها من مكان واحد.</span></div><button className="wd-primary" onClick={() => navigate('/wedding-admin/new')}><Plus size={18}/> دعوة جديدة</button></header>
    <section className="wd-stats"><div><span>كل الدعوات</span><strong>{items.length}</strong></div><div><span>منشورة</span><strong>{items.filter(i=>i.status==='published').length}</strong></div><div><span>مسودات</span><strong>{items.filter(i=>i.status==='draft').length}</strong></div></section>
    <section className="wd-card"><div className="wd-list-head"><h2>كل الدعوات</h2><span>{items.length} دعوة</span></div>
      <div className="wd-invite-grid">{items.map(item => <article className="wd-invite" key={item.id}>
        <div className="wd-invite-cover"><img src="/wedding-assets/opening-bg.webp" alt=""/><span className={`wd-status ${item.status}`}>{item.status==='published'?'منشورة':'مسودة'}</span><div>{item.brideName?.[0] || 'ع'} <i>&</i> {item.groomName?.[0] || 'ع'}</div></div>
        <div className="wd-invite-body"><p>القالب 01 · رويال برجاندي</p><h3>{item.brideName || 'دعوة'} <i>&</i> {item.groomName || 'جديدة'}</h3><dl><div><CalendarDays size={15}/><span>{item.weddingDate || 'لم يُحدد التاريخ'}</span></div><div><Link2 size={15}/><span>/invite/{item.slug || 'draft'}</span></div></dl>
          <div className="wd-actions"><button onClick={() => navigate(`/wedding-admin/invitations/${item.id}/edit`)}><Settings2 size={15}/> تعديل</button><a href={`/invite/${item.slug}`} target="_blank"><Eye size={15}/> معاينة</a><button title="نسخ الدعوة" onClick={()=>duplicate(item)}><Copy size={15}/></button><button className="danger" title="حذف" onClick={()=>remove(item)}><Trash2 size={15}/></button></div>
        </div></article>)}</div>
    </section>
  </Shell>;
}

const Field = ({ label, children, wide=false }: { label:string; children:React.ReactNode; wide?:boolean }) => <label className={`wd-field${wide?' wide':''}`}><span>{label}</span>{children}</label>;

function InvitationEditor({ id }: { id?: string }) {
  const existing = id ? getInvitationById(id) : undefined;
  const [data, setData] = useState<Invitation>(existing || emptyInvitation());
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  useEffect(() => {
    if (!id) return;
    void getInvitationByIdWithMedia(id).then((loaded) => { if (loaded) setData(loaded); });
  }, [id]);
  const set = <K extends keyof Invitation>(key: K, value: Invitation[K]) => { setSaved(false); setData(prev => ({...prev,[key]:value})); };
  const upload = (key: 'venueImage'|'musicUrl', file?: File) => { if (!file) return; const reader=new FileReader(); reader.onload=()=>set(key, String(reader.result)); reader.readAsDataURL(file); };
  const uploadGallery = (files: FileList | null) => { if(!files)return; Promise.all([...files].map(file=>new Promise<string>(resolve=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.readAsDataURL(file)}))).then(images=>set('galleryImages', images)); };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = submitter?.value as 'draft' | 'published' | 'current' | undefined;
    const status = intent === 'published' ? 'published' : intent === 'draft' ? 'draft' : data.status;
    const slug = data.slug || slugify(`${data.brideName}-${data.groomName}`) || `wedding-${data.id.slice(0, 8)}`;
    const savedInvitation = { ...data, slug, status, updatedAt: new Date().toISOString() };
    try {
      await saveInvitation(savedInvitation);
      setData(savedInvitation);
      if (window.location.pathname === '/wedding-admin/new') {
        window.history.replaceState({}, '', `/wedding-admin/invitations/${savedInvitation.id}/edit`);
      }
      setSaveError('');
      setSaved(true);
    } catch (error) {
      setSaved(false);
      setSaveError(error instanceof Error ? error.message : 'تعذر حفظ الدعوة. حاولي مرة أخرى.');
    }
  };
  return <Shell active="invitations">
    <header className="wd-page-head editor"><div><button className="wd-back" onClick={()=>navigate('/wedding-admin')}>العودة لكل الدعوات ←</button><h1>{existing ? 'تعديل الدعوة' : 'إنشاء دعوة جديدة'}</h1><span>القالب 01 · رويال برجاندي</span></div><div className="wd-head-actions"><button className="wd-secondary" type="submit" form="invitation-editor" name="saveIntent" value="draft"><Save size={17}/> حفظ كمسودة</button><button className="wd-primary" type="submit" form="invitation-editor" name="saveIntent" value="published"><Eye size={17}/> نشر الدعوة</button></div></header>
    {saved && <div className="wd-toast">تم حفظ الدعوة بنجاح. <a href={`/invite/${data.slug}`} target="_blank">مشاهدة الدعوة</a></div>}
    {saveError && <div className="wd-toast" style={{borderColor:'#e8b7bd',background:'#fff0f2',color:'#8d1f31'}}>{saveError}</div>}
    <form id="invitation-editor" className="wd-editor" onSubmit={submit}>
      <section className="wd-form-card"><div className="wd-form-title"><span><LayoutDashboard size={18}/></span><div><h2>القالب</h2><p>اختاري التصميم الجاهز لهذه الدعوة.</p></div></div><label className="wd-template-choice"><input type="radio" checked readOnly/><img src="/wedding-assets/opening-bg.webp" alt="رويال برجاندي"/><div><strong>القالب 01</strong><span>رويال برجاندي</span></div><b>مُحدد</b></label></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><Heart size={18}/></span><div><h2>البيانات الأساسية</h2><p>بيانات العروسين وموعد الحفل.</p></div></div><div className="wd-fields"><Field label="اسم العروس"><input required value={data.brideName} onChange={e=>set('brideName',e.target.value)}/></Field><Field label="اسم العريس"><input required value={data.groomName} onChange={e=>set('groomName',e.target.value)}/></Field><Field label="تاريخ الزفاف"><input required type="date" value={data.weddingDate} onChange={e=>set('weddingDate',e.target.value)}/></Field><Field label="وقت فتح الدعوة"><input type="time" value={data.openingTime} onChange={e=>set('openingTime',e.target.value)}/></Field><Field label="وقت الحفل"><input type="time" value={data.ceremonyTime} onChange={e=>set('ceremonyTime',e.target.value)}/></Field><Field label="رابط الدعوة"><div className="wd-slug" dir="ltr"><span>/invite/</span><input value={data.slug} placeholder="يُنشأ تلقائيًا من الاسمين" onChange={e=>set('slug',slugify(e.target.value))}/></div></Field></div></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><MapPin size={18}/></span><div><h2>المكان</h2><p>تفاصيل موقع الحفل التي ستظهر للضيوف.</p></div></div><div className="wd-fields"><Field label="اسم القاعة أو الفندق"><input value={data.venueName} onChange={e=>set('venueName',e.target.value)}/></Field><Field label="العنوان الكامل"><input value={data.address} onChange={e=>set('address',e.target.value)}/></Field><Field label="رابط خرائط Google" wide><input dir="ltr" type="url" value={data.mapsUrl} onChange={e=>set('mapsUrl',e.target.value)}/></Field></div></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><Settings2 size={18}/></span><div><h2>المحتوى</h2><p>نص الدعوة وبيانات التواصل.</p></div></div><div className="wd-fields"><Field label="نص الدعوة" wide><textarea rows={4} value={data.invitationText} onChange={e=>set('invitationText',e.target.value)}/></Field><Field label="الزي المطلوب"><input value={data.dressCode} onChange={e=>set('dressCode',e.target.value)}/></Field><Field label="آخر موعد لتأكيد الحضور"><input type="date" value={data.rsvpDeadline} onChange={e=>set('rsvpDeadline',e.target.value)}/></Field><Field label="رقم التواصل"><input dir="ltr" value={data.contactNumber} onChange={e=>set('contactNumber',e.target.value)}/></Field></div></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><ImagePlus size={18}/></span><div><h2>الصور والموسيقى</h2><p>ارفعي صور الدعوة والموسيقى المناسبة.</p></div></div><div className="wd-upload-grid"><label><ImagePlus size={24}/><strong>صورة المكان</strong><span>{data.venueImage?'تم اختيار الصورة':'PNG أو JPG أو WEBP'}</span><input hidden type="file" accept="image/*" onChange={e=>upload('venueImage',e.target.files?.[0])}/></label><label><ImagePlus size={24}/><strong>صور المعرض</strong><span>{data.galleryImages.length?`تم اختيار ${data.galleryImages.length} صور`:'يمكن اختيار أكثر من صورة'}</span><input hidden multiple type="file" accept="image/*" onChange={e=>uploadGallery(e.target.files)}/></label><label><Music2 size={24}/><strong>موسيقى الزفاف</strong><span>{data.musicUrl?'تم اختيار ملف MP3':'رفع ملف MP3'}</span><input hidden type="file" accept="audio/mpeg" onChange={e=>upload('musicUrl',e.target.files?.[0])}/></label></div></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><LayoutDashboard size={18}/></span><div><h2>أقسام الدعوة</h2><p>شغّلي أو أخفي الأقسام التي تريدينها.</p></div></div><div className="wd-switches">{Object.entries(data.sections).map(([key,value])=><label key={key}><span>{{countdown:'العد التنازلي',venue:'المكان والخريطة',gallery:'معرض الصور',dressCode:'الزي المطلوب',rsvp:'تأكيد الحضور',music:'الموسيقى'}[key] || key}</span><input type="checkbox" checked={value} onChange={e=>set('sections',{...data.sections,[key]:e.target.checked})}/><i/></label>)}</div></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><Settings2 size={18}/></span><div><h2>ألوان الدعوة</h2><p>غيّري الألوان فقط، وسيظل التصميم والحركة محفوظين.</p></div></div><div className="wd-colors">{Object.entries(data.theme).map(([key,value])=><label key={key}><span>{{primary:'اللون الأساسي',secondary:'اللون الثانوي',background:'لون الخلفية',text:'لون النص'}[key] || key}</span><div dir="ltr"><input type="color" value={value} onChange={e=>set('theme',{...data.theme,[key]:e.target.value})}/><code>{value}</code></div></label>)}</div></section>
      <div className="wd-form-footer"><button type="button" className="wd-secondary" onClick={()=>navigate('/wedding-admin')}>إلغاء</button><button className="wd-primary" type="submit" name="saveIntent" value="current"><Save size={17}/> حفظ الدعوة</button></div>
    </form>
  </Shell>;
}

function RsvpList() {
  const invitations=getInvitations(); const responses=getRsvps();
  return <Shell active="rsvp"><header className="wd-page-head"><div><p>ردود الضيوف</p><h1>تأكيدات الحضور</h1><span>كل الردود المستلمة من الدعوات المنشورة.</span></div></header><section className="wd-card"><div className="wd-list-head"><h2>أحدث الردود</h2><span>{responses.length} رد</span></div>{responses.length===0?<div className="wd-empty"><Users size={32}/><h3>لا توجد ردود حتى الآن</h3><p>ستظهر هنا أسماء الضيوف وحالة الحضور وعدد المرافقين والرسالة.</p></div>:<div className="wd-table-wrap"><table><thead><tr><th>اسم الضيف</th><th>الدعوة</th><th>الحضور</th><th>عدد الضيوف</th><th>الرسالة</th><th>تاريخ الإرسال</th></tr></thead><tbody>{responses.map(r=><tr key={r.id}><td>{r.guestName}</td><td>{invitations.find(i=>i.id===r.invitationId)?.brideName || 'الدعوة'}</td><td><span className={`wd-status ${r.attending?'published':'draft'}`}>{r.attending?'سيحضر':'لن يحضر'}</span></td><td>{r.guests}</td><td>{r.message||'—'}</td><td>{new Date(r.submittedAt).toLocaleDateString('ar')}</td></tr>)}</tbody></table></div>}</section></Shell>;
}

export default function WeddingDashboard() {
  const path=window.location.pathname;
  const edit=path.match(/^\/wedding-admin\/invitations\/([^/]+)\/edit$/);
  if(path==='/wedding-admin/new') return <InvitationEditor/>;
  if(edit) return <InvitationEditor id={edit[1]}/>;
  if(path==='/wedding-admin/rsvp') return <RsvpList/>;
  return <InvitationsList/>;
}
