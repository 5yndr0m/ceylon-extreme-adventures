// src/app/experiences/[slug]/InquiryForm.tsx
'use client'

import {useState} from 'react'

const INQUIRY_EMAIL = 'sales@extremeadventure.lk'

export default function InquiryForm({experienceTitle}: {experienceTitle: string}) {
  const [form, setForm] = useState({fullName: '', phone: '', email: '', message: ''})

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
