// src/app/experiences/[slug]/BookingForm.tsx
'use client'

import {useState} from 'react'

export default function BookingForm({
  experienceId,
  experienceTitle,
}: {
  experienceId: string
  experienceTitle: string
}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
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
      setBookingId(data.bookingId)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  async function payWithPayHere() {
    if (!bookingId) return
    setPaying(true)
    const res = await fetch('/api/checkout/payhere', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({bookingId}),
    })
    const {checkoutUrl, fields} = await res.json()

    // PayHere requires an actual HTML form POST, not a redirect to a URL with query params —
    // so we build one dynamically and submit it, rather than window.location.href like Stripe
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = checkoutUrl
    for (const [key, value] of Object.entries(fields)) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = value as string
      form.appendChild(input)
    }
    document.body.appendChild(form)
    form.submit()
  }

  if (status === 'success') {
    return (
      <div className="py-4">
        <p className="font-semibold mb-1">Almost there!</p>
        <p className="text-sm text-gray-500 mb-5">
          Complete payment to confirm your booking for {experienceTitle}.
        </p>
        <button
          onClick={payWithPayHere}
          disabled={paying}
          className="w-full bg-orange-600 text-white rounded-full py-3 font-semibold disabled:opacity-50"
        >
          {paying ? 'Redirecting…' : 'Pay Now'}
        </button>
        {/* PayHere accepts Visa/Mastercard/Amex/Discover/Diners for both local (LKR) and
            international (USD/GBP/EUR/AUD) cards — one gateway covers both customer types,
            so a separate international provider isn't needed. Stripe was ruled out: Sri Lanka
            isn't a supported country for merchant accounts. */}
        <p className="text-xs text-gray-400 mt-4">
          Your enquiry is saved — you can also complete payment later from the confirmation email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        placeholder="Full name"
        className="w-full border rounded px-3 py-2 text-sm"
        value={form.fullName}
        onChange={(e) => setForm({...form, fullName: e.target.value})}
      />
      <input
        required
        type="email"
        placeholder="you@email.com"
        className="w-full border rounded px-3 py-2 text-sm"
        value={form.email}
        onChange={(e) => setForm({...form, email: e.target.value})}
      />
      <input
        placeholder="+94 7X XXX XXXX"
        className="w-full border rounded px-3 py-2 text-sm"
        value={form.phone}
        onChange={(e) => setForm({...form, phone: e.target.value})}
      />
      <input
        required
        type="date"
        className="w-full border rounded px-3 py-2 text-sm"
        value={form.preferredDate}
        onChange={(e) => setForm({...form, preferredDate: e.target.value})}
      />
      <input
        required
        type="number"
        min={1}
        placeholder="Group size"
        className="w-full border rounded px-3 py-2 text-sm"
        value={form.groupSize}
        onChange={(e) => setForm({...form, groupSize: Number(e.target.value)})}
      />
      <textarea
        placeholder="Anything we should know?"
        className="w-full border rounded px-3 py-2 text-sm"
        rows={3}
        value={form.message}
        onChange={(e) => setForm({...form, message: e.target.value})}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-orange-600 text-white rounded-full py-3 font-semibold disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Enquiry'}
      </button>
      {status === 'error' && (
        <p className="text-red-600 text-sm">Something went wrong — please try again.</p>
      )}
    </form>
  )
}
