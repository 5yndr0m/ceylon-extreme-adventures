// src/app/events/[month]/[eventSlug]/EventBookingForm.tsx
'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'

// Mirrors BookingForm.tsx's light-theme field styling (same reasoning: this sits on a
// white card, and globals.css's dark-theme label/input rules are scoped to .booking-form
// on /contact, not this form — see BookingForm.tsx for the fuller explanation). The date
// isn't a field here at all: it's fixed by the event, not chosen by the customer.
const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'
const inputClass =
  'w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="ebf-fullName" className={labelClass}>Full Name</label>
        <input
          id="ebf-fullName"
          required
          placeholder="Your full name"
          className={inputClass}
          value={form.fullName}
          onChange={(e) => setForm({...form, fullName: e.target.value})}
        />
      </div>

      <div>
        <label htmlFor="ebf-email" className={labelClass}>Email</label>
        <input
          id="ebf-email"
          required
          type="email"
          placeholder="you@email.com"
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
        />
      </div>

      <div>
        <label htmlFor="ebf-phone" className={labelClass}>Phone</label>
        <input
          id="ebf-phone"
          placeholder="+94 7X XXX XXXX"
          className={inputClass}
          value={form.phone}
          onChange={(e) => setForm({...form, phone: e.target.value})}
        />
      </div>

      <div>
        <label htmlFor="ebf-group" className={labelClass}>Group Size</label>
        <input
          id="ebf-group"
          required
          type="number"
          min={1}
          placeholder="e.g. 2"
          className={inputClass}
          value={form.groupSize}
          onChange={(e) => setForm({...form, groupSize: Number(e.target.value)})}
        />
      </div>

      <div>
        <label htmlFor="ebf-message" className={labelClass}>Message</label>
        <textarea
          id="ebf-message"
          placeholder="Anything we should know?"
          className={inputClass}
          rows={3}
          value={form.message}
          onChange={(e) => setForm({...form, message: e.target.value})}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-orange-600 text-white rounded-full py-3 font-semibold disabled:opacity-50"
      >
        {status === 'submitting' ? 'Continuing…' : 'Continue to Payment'}
      </button>
      {status === 'error' && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}
    </form>
  )
}
