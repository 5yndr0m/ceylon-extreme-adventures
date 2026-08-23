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
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <p className="font-semibold mb-2">Request received!</p>
        <p className="text-sm text-gray-500">
          We'll follow up by email/phone to confirm your booking for {experienceTitle}.
        </p>
        {/* Payment step gets added here later — this currently just captures the request
            as a Pending booking, per the phased plan (register first, pay comes next) */}
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
