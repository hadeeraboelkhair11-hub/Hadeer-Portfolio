import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { CalendarDays, Copy, Eye, Heart, ImagePlus, LayoutDashboard, Link2, MapPin, Music2, Plus, Save, Settings2, Trash2, Users } from 'lucide-react';
import { deleteInvitation, duplicateInvitation, emptyInvitation, getInvitationById, getInvitations, getRsvps, saveInvitation } from '../wedding/store';
import type { Invitation } from '../wedding/types';
import './WeddingDashboard.css';

const navigate = (path: string) => { window.location.assign(path); };
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const SideNav = ({ active }: { active: 'invitations' | 'rsvp' }) => (
  <aside className="wd-sidebar">
    <button className="wd-brand" onClick={() => navigate('/wedding-admin')}><span>W</span><div>Wedding Studio<small>Invitation manager</small></div></button>
    <nav>
      <button className={active === 'invitations' ? 'active' : ''} onClick={() => navigate('/wedding-admin')}><LayoutDashboard size={18}/> Invitations</button>
      <button className={active === 'rsvp' ? 'active' : ''} onClick={() => navigate('/wedding-admin/rsvp')}><Users size={18}/> RSVP Responses</button>
    </nav>
    <div className="wd-template-note"><span>01</span><div><strong>Royal Burgundy</strong><small>Active template</small></div></div>
  </aside>
);

const Shell = ({ active, children }: { active: 'invitations' | 'rsvp'; children: React.ReactNode }) => <div className="wd-app"><SideNav active={active}/><main className="wd-main">{children}</main></div>;

function InvitationsList() {
  const [items, setItems] = useState(getInvitations);
  const remove = (item: Invitation) => {
    if (!window.confirm(`Delete the invitation for ${item.brideName} & ${item.groomName}?`)) return;
    deleteInvitation(item.id); setItems(getInvitations());
  };
  const duplicate = (item: Invitation) => { const copy = duplicateInvitation(item); saveInvitation(copy); setItems(getInvitations()); };
  return <Shell active="invitations">
    <header className="wd-page-head"><div><p>WEDDING INVITATIONS</p><h1>Invitations</h1><span>Create, publish and manage every celebration.</span></div><button className="wd-primary" onClick={() => navigate('/wedding-admin/new')}><Plus size={18}/> New invitation</button></header>
    <section className="wd-stats"><div><span>All invitations</span><strong>{items.length}</strong></div><div><span>Published</span><strong>{items.filter(i=>i.status==='published').length}</strong></div><div><span>Drafts</span><strong>{items.filter(i=>i.status==='draft').length}</strong></div></section>
    <section className="wd-card"><div className="wd-list-head"><h2>All invitations</h2><span>{items.length} records</span></div>
      <div className="wd-invite-grid">{items.map(item => <article className="wd-invite" key={item.id}>
        <div className="wd-invite-cover"><img src="/wedding-assets/opening-bg.webp" alt=""/><span className={`wd-status ${item.status}`}>{item.status}</span><div>{item.brideName?.[0] || 'W'} <i>&</i> {item.groomName?.[0] || 'I'}</div></div>
        <div className="wd-invite-body"><p>Template 01 · Royal Burgundy</p><h3>{item.brideName || 'Untitled'} <i>&</i> {item.groomName || 'Invitation'}</h3><dl><div><CalendarDays size={15}/><span>{item.weddingDate || 'Date not set'}</span></div><div><Link2 size={15}/><span>/invite/{item.slug || 'draft'}</span></div></dl>
          <div className="wd-actions"><button onClick={() => navigate(`/wedding-admin/invitations/${item.id}/edit`)}><Settings2 size={15}/> Edit</button><a href={`/invite/${item.slug}`} target="_blank"><Eye size={15}/> Preview</a><button title="Duplicate" onClick={()=>duplicate(item)}><Copy size={15}/></button><button className="danger" title="Delete" onClick={()=>remove(item)}><Trash2 size={15}/></button></div>
        </div></article>)}</div>
    </section>
  </Shell>;
}

const Field = ({ label, children, wide=false }: { label:string; children:React.ReactNode; wide?:boolean }) => <label className={`wd-field${wide?' wide':''}`}><span>{label}</span>{children}</label>;

function InvitationEditor({ id }: { id?: string }) {
  const existing = id ? getInvitationById(id) : undefined;
  const [data, setData] = useState<Invitation>(existing || emptyInvitation());
  const [saved, setSaved] = useState(false);
  const set = <K extends keyof Invitation>(key: K, value: Invitation[K]) => { setSaved(false); setData(prev => ({...prev,[key]:value})); };
  const upload = (key: 'venueImage'|'musicUrl', file?: File) => { if (!file) return; const reader=new FileReader(); reader.onload=()=>set(key, String(reader.result)); reader.readAsDataURL(file); };
  const uploadGallery = (files: FileList | null) => { if(!files)return; Promise.all([...files].map(file=>new Promise<string>(resolve=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.readAsDataURL(file)}))).then(images=>set('galleryImages', images)); };
  const submit = (event: FormEvent, status: 'draft'|'published') => { event.preventDefault(); const slug=data.slug||slugify(`${data.brideName}-${data.groomName}`); saveInvitation({...data,slug,status,updatedAt:new Date().toISOString()}); setData(prev=>({...prev,slug,status})); setSaved(true); };
  return <Shell active="invitations">
    <header className="wd-page-head editor"><div><button className="wd-back" onClick={()=>navigate('/wedding-admin')}>← All invitations</button><h1>{existing ? 'Edit invitation' : 'Create invitation'}</h1><span>Template 01 · Royal Burgundy</span></div><div className="wd-head-actions"><button className="wd-secondary" onClick={(e)=>submit(e as any,'draft')}><Save size={17}/> Save draft</button><button className="wd-primary" onClick={(e)=>submit(e as any,'published')}><Eye size={17}/> Publish</button></div></header>
    {saved && <div className="wd-toast">Invitation saved successfully. <a href={`/invite/${data.slug}`} target="_blank">View invitation</a></div>}
    <form className="wd-editor" onSubmit={(e)=>submit(e,'draft')}>
      <section className="wd-form-card"><div className="wd-form-title"><span><LayoutDashboard size={18}/></span><div><h2>Template</h2><p>Choose the programmed design for this invitation.</p></div></div><label className="wd-template-choice"><input type="radio" checked readOnly/><img src="/wedding-assets/opening-bg.webp" alt="Royal Burgundy"/><div><strong>Template 01</strong><span>Royal Burgundy</span></div><b>Selected</b></label></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><Heart size={18}/></span><div><h2>Basic details</h2><p>The couple and ceremony schedule.</p></div></div><div className="wd-fields"><Field label="Bride name"><input required value={data.brideName} onChange={e=>set('brideName',e.target.value)}/></Field><Field label="Groom name"><input required value={data.groomName} onChange={e=>set('groomName',e.target.value)}/></Field><Field label="Wedding date"><input required type="date" value={data.weddingDate} onChange={e=>set('weddingDate',e.target.value)}/></Field><Field label="Opening time"><input type="time" value={data.openingTime} onChange={e=>set('openingTime',e.target.value)}/></Field><Field label="Ceremony time"><input type="time" value={data.ceremonyTime} onChange={e=>set('ceremonyTime',e.target.value)}/></Field><Field label="Public slug"><div className="wd-slug"><span>/invite/</span><input required value={data.slug} onChange={e=>set('slug',slugify(e.target.value))}/></div></Field></div></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><MapPin size={18}/></span><div><h2>Venue</h2><p>Location details shown on the invitation.</p></div></div><div className="wd-fields"><Field label="Venue name"><input value={data.venueName} onChange={e=>set('venueName',e.target.value)}/></Field><Field label="Full address"><input value={data.address} onChange={e=>set('address',e.target.value)}/></Field><Field label="Google Maps URL" wide><input type="url" value={data.mapsUrl} onChange={e=>set('mapsUrl',e.target.value)}/></Field></div></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><Settings2 size={18}/></span><div><h2>Content</h2><p>Guest-facing wording and contact details.</p></div></div><div className="wd-fields"><Field label="Invitation text" wide><textarea rows={4} value={data.invitationText} onChange={e=>set('invitationText',e.target.value)}/></Field><Field label="Dress code"><input value={data.dressCode} onChange={e=>set('dressCode',e.target.value)}/></Field><Field label="RSVP deadline"><input type="date" value={data.rsvpDeadline} onChange={e=>set('rsvpDeadline',e.target.value)}/></Field><Field label="Contact number"><input value={data.contactNumber} onChange={e=>set('contactNumber',e.target.value)}/></Field></div></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><ImagePlus size={18}/></span><div><h2>Media</h2><p>Upload imagery and optional music for this invitation.</p></div></div><div className="wd-upload-grid"><label><ImagePlus size={24}/><strong>Venue image</strong><span>{data.venueImage?'Image selected':'PNG, JPG or WEBP'}</span><input hidden type="file" accept="image/*" onChange={e=>upload('venueImage',e.target.files?.[0])}/></label><label><ImagePlus size={24}/><strong>Gallery images</strong><span>{data.galleryImages.length?`${data.galleryImages.length} images selected`:'Choose multiple images'}</span><input hidden multiple type="file" accept="image/*" onChange={e=>uploadGallery(e.target.files)}/></label><label><Music2 size={24}/><strong>Wedding music</strong><span>{data.musicUrl?'MP3 selected':'Upload MP3'}</span><input hidden type="file" accept="audio/mpeg" onChange={e=>upload('musicUrl',e.target.files?.[0])}/></label></div></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><LayoutDashboard size={18}/></span><div><h2>Sections</h2><p>Choose which parts appear in the public invitation.</p></div></div><div className="wd-switches">{Object.entries(data.sections).map(([key,value])=><label key={key}><span>{key==='venue'?'Venue / Map':key.replace(/([A-Z])/g,' $1')}</span><input type="checkbox" checked={value} onChange={e=>set('sections',{...data.sections,[key]:e.target.checked})}/><i/></label>)}</div></section>
      <section className="wd-form-card"><div className="wd-form-title"><span><Settings2 size={18}/></span><div><h2>Theme</h2><p>Simple color controls; layout and animation stay protected.</p></div></div><div className="wd-colors">{Object.entries(data.theme).map(([key,value])=><label key={key}><span>{key} color</span><div><input type="color" value={value} onChange={e=>set('theme',{...data.theme,[key]:e.target.value})}/><code>{value}</code></div></label>)}</div></section>
      <div className="wd-form-footer"><button type="button" className="wd-secondary" onClick={()=>navigate('/wedding-admin')}>Cancel</button><button className="wd-primary" type="submit"><Save size={17}/> Save invitation</button></div>
    </form>
  </Shell>;
}

function RsvpList() {
  const invitations=getInvitations(); const responses=getRsvps();
  return <Shell active="rsvp"><header className="wd-page-head"><div><p>GUEST RESPONSES</p><h1>RSVP Responses</h1><span>Responses collected from every published invitation.</span></div></header><section className="wd-card"><div className="wd-list-head"><h2>Latest responses</h2><span>{responses.length} responses</span></div>{responses.length===0?<div className="wd-empty"><Users size={32}/><h3>No responses yet</h3><p>Guest submissions will appear here with attendance, party size and message.</p></div>:<div className="wd-table-wrap"><table><thead><tr><th>Guest</th><th>Invitation</th><th>Attendance</th><th>Guests</th><th>Message</th><th>Submitted</th></tr></thead><tbody>{responses.map(r=><tr key={r.id}><td>{r.guestName}</td><td>{invitations.find(i=>i.id===r.invitationId)?.brideName || 'Invitation'}</td><td><span className={`wd-status ${r.attending?'published':'draft'}`}>{r.attending?'Attending':'Not attending'}</span></td><td>{r.guests}</td><td>{r.message||'—'}</td><td>{new Date(r.submittedAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>}</section></Shell>;
}

export default function WeddingDashboard() {
  const path=window.location.pathname;
  const edit=path.match(/^\/wedding-admin\/invitations\/([^/]+)\/edit$/);
  if(path==='/wedding-admin/new') return <InvitationEditor/>;
  if(edit) return <InvitationEditor id={edit[1]}/>;
  if(path==='/wedding-admin/rsvp') return <RsvpList/>;
  return <InvitationsList/>;
}
