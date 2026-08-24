// src/app/booking-confirmed/page.tsx
import {client} from '@/lib/sanity'

export const dynamic = 'force-dynamic' // always check current status, never cache this page

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{booking_id?: string}>
}) {
  const {booking_id} = await searchParams

  const booking = booking_id
    ? await client.fetch(
        `*[_type == "booking" && _id == $id][0]{
          paymentStatus, fullName, preferredDate, groupSize,
          experience->{title}
        }`,
        {id: booking_id}
      )
    : null

  return (
    <main className="max-w-xl mx-auto px-6 py-24 text-center">
      {!booking ? (
        <p>We couldn't find that booking. If you completed payment, check your email for confirmation.</p>
      ) : booking.paymentStatus === 'Paid' ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Booking Confirmed 🎉</h1>
          <p className="text-gray-600 mb-2">
            {booking.experience.title} — {booking.preferredDate} — {booking.groupSize} people
          </p>
          <p className="text-sm text-gray-400">
            Our team will call you within 24 hours to confirm logistics.
          </p>
        </>
      ) : (
        // Redirect lands here even if the webhook hasn't processed yet (browser redirect
        // fires immediately, webhook can lag a few seconds) — hence "processing", not "failed"
        <>
          <h1 className="text-2xl font-bold mb-4">Processing your payment…</h1>
          <p className="text-gray-600">
            This can take a few moments. Refresh this page shortly, or check your email —
            we'll send confirmation as soon as payment clears.
          </p>
        </>
      )}
    </main>
  )
}
