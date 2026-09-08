// src/app/events/[month]/[eventSlug]/EventBookingForm.tsx
'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'

// The date isn't a field here at all: it's fixed by the event, not chosen by the
// customer (see the sticky card next to this form for the departure date/price).
export default function EventBookingForm({eventId}: {eventId: string}) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    groupSize: 1,
    message: '',
  })

  function updateGroupSize(delta: number) {
    setForm((f) => ({...f, groupSize: Math.max(1, f.groupSize + delta)}))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({eventId, ...form}),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')

      router.push(`/payment?booking_id=${data.bookingId}`)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong — please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bp-form">
      <div className="bp-form-row">
        <label htmlFor="ebf-fullName">Full name</label>
        <input
          id="ebf-fullName"
          required
          placeholder="Your full name"
          value={form.fullName}
          onChange={(e) => setForm({...form, fullName: e.target.value})}
        />
      </div>

      <div className="bp-form-row bp-form-row-split">
        <div>
          <label htmlFor="ebf-email">Email</label>
          <input
            id="ebf-email"
            required
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
        </div>
        <div>
          <label htmlFor="ebf-phone">Phone</label>
          <input
            id="ebf-phone"
            placeholder="+94 7X XXX XXXX"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />
        </div>
      </div>

      <div className="bp-form-row">
        <label>Slots</label>
        <div className="bp-stepper">
          <button type="button" onClick={() => updateGroupSize(-1)} aria-label="Decrease group size">−</button>
          <span>{form.groupSize}</span>
          <button type="button" onClick={() => updateGroupSize(1)} aria-label="Increase group size">+</button>
        </div>
      </div>

      <div className="bp-form-row">
        <label htmlFor="ebf-message">Message (optional)</label>
        <textarea
          id="ebf-message"
          placeholder="Anything we should know?"
          rows={2}
          value={form.message}
          onChange={(e) => setForm({...form, message: e.target.value})}
        />
      </div>

      <button type="submit" disabled={status === 'submitting'} className="btn btn-primary bp-submit">
        {status === 'submitting' ? 'Continuing…' : 'Continue to Payment'}
      </button>
      {status === 'error' && <p className="bp-form-error">{errorMessage}</p>}
    </form>
  )
}
