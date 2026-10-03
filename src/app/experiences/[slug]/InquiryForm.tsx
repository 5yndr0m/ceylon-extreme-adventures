// src/app/experiences/[slug]/InquiryForm.tsx
'use client'

import {useState} from 'react'

const INQUIRY_EMAIL = 'sales@extremeadventure.lk'

export default function InquiryForm({experienceTitle}: {experienceTitle: string}) {
  const [form, setForm] = useState({fullName: '', phone: '', email: '', message: ''})
  // "Sent" only means we handed off to the visitor's mail client — mailto: gives no
  // signal back on whether a mail app actually opened, so the confirmation below
  // always shows a visible fallback address rather than claiming delivery.
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = `Inquiry for ${experienceTitle}`
    const body = [
      `Name: ${form.fullName}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      '',
      'Message:',
      form.message,
    ].join('\n')
    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="bp-form-success" role="status">
        <p style={{margin: '0 0 8px', fontWeight: 700, color: 'var(--basalt-black)'}}>
          Opening your email app now
        </p>
        <p style={{margin: '0 0 16px'}}>
          It should open addressed to <strong>{INQUIRY_EMAIL}</strong> with your message filled in — just
          hit send there. If nothing opens (no mail app set up on this device), email us directly at{' '}
          <a href={`mailto:${INQUIRY_EMAIL}`}>{INQUIRY_EMAIL}</a> or call{' '}
          <a href="tel:+94707900700">+94 707 900 700</a>.
        </p>
        <button type="button" className="btn btn-dark" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bp-form">
      <div className="bp-form-row">
        <label htmlFor="if-fullName">Full name</label>
        <input
          id="if-fullName"
          required
          placeholder="Your full name"
          value={form.fullName}
          onChange={(e) => setForm({...form, fullName: e.target.value})}
        />
      </div>

      <div className="bp-form-row bp-form-row-split">
        <div>
          <label htmlFor="if-phone">Phone</label>
          <input
            id="if-phone"
            required
            placeholder="+94 7X XXX XXXX"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />
        </div>
        <div>
          <label htmlFor="if-email">Email</label>
          <input
            id="if-email"
            required
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
        </div>
      </div>

      <div className="bp-form-row">
        <label htmlFor="if-message">Message</label>
        <textarea
          id="if-message"
          required
          placeholder="Tell us what you'd like to know…"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({...form, message: e.target.value})}
        />
      </div>

      <button type="submit" className="btn btn-primary bp-submit">Send Inquiry</button>
    </form>
  )
}
