// src/app/experiences/[slug]/BookingForm.tsx
'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'

// This form sits on a white card (see the experience detail page), unlike the enquiry
// form on /contact which sits on a dark green section. Every input/label here sets its
// own colors explicitly rather than relying on globals.css defaults, since those globals
// are written for the dark .booking-form context and previously made this form render as
// invisible white-on-white text with no visible labels at all.
const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'
const inputClass =
  'w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'

export default function BookingForm({
  experienceId,
  experienceTitle,
}: {
  experienceId: string
  experienceTitle: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    groupSize: 1,
    message: '',
  })

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

      // Send the customer to the review/payment page instead of going straight to
      // PayHere — lets them double-check details before paying, and reuses the
      // summary UI already built there rather than skipping it
      router.push(`/payment?booking_id=${data.bookingId}`)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="bf-fullName" className={labelClass}>Full Name</label>
        <input
          id="bf-fullName"
          required
          placeholder="Your full name"
          className={inputClass}
          value={form.fullName}
          onChange={(e) => setForm({...form, fullName: e.target.value})}
        />
      </div>

      <div>
        <label htmlFor="bf-email" className={labelClass}>Email</label>
        <input
          id="bf-email"
          required
          type="email"
          placeholder="you@email.com"
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
        />
      </div>

      <div>
        <label htmlFor="bf-phone" className={labelClass}>Phone</label>
        <input
          id="bf-phone"
          placeholder="+94 7X XXX XXXX"
          className={inputClass}
          value={form.phone}
          onChange={(e) => setForm({...form, phone: e.target.value})}
        />
      </div>

      <div>
        <label htmlFor="bf-date" className={labelClass}>Preferred Date</label>
        <input
          id="bf-date"
          required
          type="date"
          className={inputClass}
          value={form.preferredDate}
          onChange={(e) => setForm({...form, preferredDate: e.target.value})}
        />
      </div>

      <div>
        <label htmlFor="bf-group" className={labelClass}>Group Size</label>
        <input
          id="bf-group"
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
        <label htmlFor="bf-message" className={labelClass}>Message</label>
        <textarea
          id="bf-message"
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
        {status === 'submitting' ? 'Continuing…' : `Continue to Payment`}
      </button>
      {status === 'error' && (
        <p className="text-red-600 text-sm">Something went wrong — please try again.</p>
      )}
    </form>
  )
}
