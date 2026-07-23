import { useState } from 'react'
import useReveal from '../hooks/useReveal.js'
import { submitEnquiry } from '../lib/supabase.js'
import { CONTACT } from '../data/products.js'

const ROLES = ['Farmer', 'Dealer', 'Distributor', 'Other']
const CROPS = ['Hybrid Maize', 'Sweet Corn', 'Paddy', 'Wheat / Mustard (2027)', 'Not sure yet']

const inputCls =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-mute/70 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition'

export default function Enquiry() {
  const ref = useReveal()
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [form, setForm] = useState({
    name: '', phone: '', role: 'Farmer', district: '', state: '', crop: 'Hybrid Maize', message: '', company: '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (form.company) { setStatus('done'); return } // honeypot — bots fill hidden fields
    if (!form.name.trim() || !/^[\d\s+\-()]{8,15}$/.test(form.phone.trim())) {
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      await submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        role: form.role.toLowerCase(),
        district: form.district.trim() || null,
        state: form.state.trim() || null,
        crop: form.crop,
        message: form.message.trim() || null,
      })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="enquiry" ref={ref} className="relative bg-sage py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
          <div>
            <div className="reveal eyebrow eyebrow-rule text-green-700">Get in Touch</div>
            <h2 className="reveal mt-5 text-3xl sm:text-4xl leading-[1.12] text-green-950 font-light tracking-tight" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
              Tell us your crop and district. We will call you back.
            </h2>
            <p className="reveal mt-5 text-ink-soft text-[15px] leading-relaxed" style={{ '--reveal-delay': '150ms' }}>
              Whether you farm five acres or run a seed shop, leave your number and one of
              us will call you — usually within a working day.
            </p>
            <div className="reveal mt-7 space-y-3" style={{ '--reveal-delay': '200ms' }}>
              <a href={`https://wa.me/${CONTACT.customerCareRaw.replace('+', '')}?text=${encodeURIComponent('Hi Yellina Seeds, I want to know more about your seeds.')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-green-800 font-semibold text-[15px] hover:text-green-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07a8.1 8.1 0 01-2.39-1.47 8.96 8.96 0 01-1.65-2.05c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"/><path d="M12.05 2a9.9 9.9 0 00-8.4 15.17L2.06 22l4.94-1.55A9.94 9.94 0 1012.05 2zm5.83 15.78a8.25 8.25 0 01-11.66.03 8.25 8.25 0 015.83-14.1 8.26 8.26 0 015.83 14.07z"/></svg>
                WhatsApp us directly
              </a>
              <a href={`tel:${CONTACT.customerCareRaw}`} className="flex items-center gap-3 text-green-800 font-semibold text-[15px] hover:text-green-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
                {CONTACT.customerCare} · {CONTACT.hours}
              </a>
            </div>
          </div>

          <div className="reveal card p-7 md:p-9" style={{ '--reveal-delay': '160ms' }}>
            {status === 'done' ? (
              <div className="text-center py-10">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2C7A3C" strokeWidth="2.4"><path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 className="mt-5 text-2xl text-green-950" style={{ fontFamily: 'var(--font-serif)' }}>Thank you, {form.name.split(' ')[0] || 'friend'}.</h3>
                <p className="mt-2 text-ink-soft text-[14.5px]">We received your enquiry and will call you back, usually within a working day.</p>
                <button onClick={() => { setStatus('idle'); setForm({ ...form, name: '', phone: '', message: '' }) }} className="mt-6 text-green-700 text-[12px] uppercase tracking-[0.16em] font-bold cursor-pointer">
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enq-name" className="block text-[11px] uppercase tracking-[0.16em] font-bold text-ink-soft mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>Name *</label>
                    <input id="enq-name" className={inputCls} value={form.name} onChange={set('name')} placeholder="Your name" required />
                  </div>
                  <div>
                    <label htmlFor="enq-phone" className="block text-[11px] uppercase tracking-[0.16em] font-bold text-ink-soft mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>Phone / WhatsApp *</label>
                    <input id="enq-phone" className={inputCls} value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" inputMode="tel" required />
                  </div>
                  <div>
                    <label htmlFor="enq-role" className="block text-[11px] uppercase tracking-[0.16em] font-bold text-ink-soft mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>I am a</label>
                    <select id="enq-role" className={inputCls} value={form.role} onChange={set('role')}>
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="enq-crop" className="block text-[11px] uppercase tracking-[0.16em] font-bold text-ink-soft mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>Interested in</label>
                    <select id="enq-crop" className={inputCls} value={form.crop} onChange={set('crop')}>
                      {CROPS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="enq-district" className="block text-[11px] uppercase tracking-[0.16em] font-bold text-ink-soft mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>District</label>
                    <input id="enq-district" className={inputCls} value={form.district} onChange={set('district')} placeholder="e.g. Khammam" />
                  </div>
                  <div>
                    <label htmlFor="enq-state" className="block text-[11px] uppercase tracking-[0.16em] font-bold text-ink-soft mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>State</label>
                    <input id="enq-state" className={inputCls} value={form.state} onChange={set('state')} placeholder="e.g. Telangana" />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="enq-msg" className="block text-[11px] uppercase tracking-[0.16em] font-bold text-ink-soft mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>Message (optional)</label>
                  <textarea id="enq-msg" className={`${inputCls} min-h-[88px] resize-y`} value={form.message} onChange={set('message')} placeholder="Acreage, season, or anything else we should know" />
                </div>
                {/* honeypot — humans never see this */}
                <input type="text" value={form.company} onChange={set('company')} tabIndex="-1" autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, width: 0 }} />

                {status === 'error' && (
                  <p className="mt-4 text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    Please check your name and phone number. If it still fails, call or WhatsApp us at {CONTACT.customerCare}.
                  </p>
                )}

                <button type="submit" disabled={status === 'sending'} className="btn-primary mt-6 w-full justify-center disabled:opacity-60 disabled:cursor-wait">
                  {status === 'sending' ? 'Sending…' : 'Request a Call Back'}
                </button>
                <p className="mt-3 text-center text-[11.5px] text-ink-mute">We use your details only to contact you about Yellina seeds.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
