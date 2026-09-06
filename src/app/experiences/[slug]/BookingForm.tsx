// src/app/experiences/[slug]/BookingForm.tsx
'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'

export default function BookingForm({
  experienceId,
  experienceTitle,
  unitPrice,
}: {
  experienceId: string
  experienceTitle: string
  unitPrice: number
}) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    groupSize: 1,
    message: '',
  })

  const total = unitPrice * form.groupSize

  function updateGroupSize(delta: number) {
    setForm((f) => ({...f, groupSize: Math.max(1, f.groupSize + delta)}))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({experienceId, ...form}),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      router.push(`/payment?booking_id=${data.bookingId}`)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bp-form">
      <div className="bp-form-row">
        <label htmlFor="bf-date">Date</label>
        <input
          id="bf-date"
          required
          type="date"
          value={form.preferredDate}
          onChange={(e) => setForm({...form, preferredDate: e.target.value})}
        />
      </div>

      <div className="bp-form-row">
        <label>Travellers</label>
        <div className="bp-stepper">
          <button type="button" onClick={() => updateGroupSize(-1)} aria-label="Decrease group size">−</button>
          <span>{form.groupSize}</span>
          <button type="button" onClick={() => updateGroupSize(1)} aria-label="Increase group size">+</button>
        </div>
      </div>

      {unitPrice > 0 && (
        <div className="bp-total-row">
          <span>{form.groupSize} × LKR {unitPrice.toLocaleString()}</span>
          <strong>LKR {total.toLocaleString()}</strong>
        </div>
      )}

      <div className="bp-form-row">
        <label htmlFor="bf-fullName">Full name</label>
        <input
          id="bf-fullName"
          required
          placeholder="Your full name"
          value={form.fullName}
          onChange={(e) => setForm({...form, fullName: e.target.value})}
        />
      </div>

      <div className="bp-form-row bp-form-row-split">
        <div>
          <label htmlFor="bf-email">Email</label>
          <input
            id="bf-email"
            required
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
        </div>
        <div>
          <label htmlFor="bf-phone">Phone</label>
          <input
            id="bf-phone"
            placeholder="+94 7X XXX XXXX"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />
        </div>
      </div>

      <div className="bp-form-row">
        <label htmlFor="bf-message">Message (optional)</label>
        <textarea
          id="bf-message"
          placeholder="Anything we should know?"
          rows={2}
          value={form.message}
          onChange={(e) => setForm({...form, message: e.target.value})}
        />
      </div>

      <button type="submit" disabled={status === 'submitting'} className="btn btn-primary bp-submit">
        {status === 'submitting' ? 'Continuing…' : 'Continue to Payment'}
      </button>
      {status === 'error' && <p className="bp-form-error">Something went wrong — please try again.</p>}
    </form>
  )
}