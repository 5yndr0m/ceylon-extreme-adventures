// src/app/booking-confirmed/page.tsx
import Link from 'next/link'
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
    <main className="bp-page">
      <div className="container bp-top" style={{textAlign: 'center', paddingBottom: 90}}>
        {!booking ? (
          <>
            <h1 className="bp-title" style={{margin: '0 auto 14px'}}>Booking not found</h1>
            <p className="bp-prose" style={{margin: '0 auto 28px'}}>
              We couldn&apos;t find that booking. If you completed payment, check your email for confirmation.
            </p>
            <Link href="/" className="btn btn-primary">Back to Home</Link>
          </>
        ) : booking.paymentStatus === 'Paid' ? (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--mist-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--jungle-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h1 className="bp-title" style={{margin: '0 auto 14px'}}>Booking confirmed</h1>

            <div className="bp-facts-row" style={{justifyContent: 'center', marginBottom: 24}}>
              <div className="bp-fact-pill">
                <span className="bp-fact-pill-label">Experience</span>
                <span className="bp-fact-pill-value">{booking.experience.title}</span>
              </div>
              <div className="bp-fact-pill">
                <span className="bp-fact-pill-label">Date</span>
                <span className="bp-fact-pill-value">{booking.preferredDate}</span>
              </div>
              <div className="bp-fact-pill">
                <span className="bp-fact-pill-label">Slots</span>
                <span className="bp-fact-pill-value">{booking.groupSize}</span>
              </div>
            </div>

            <p className="bp-prose" style={{margin: '0 auto 28px'}}>
              Our team will call you within 24 hours to confirm logistics.
            </p>
            <div style={{display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link href="/" className="btn btn-primary">Back to Home</Link>
              <Link href="/experiences" className="btn btn-dark">Browse More Experiences</Link>
            </div>
          </>
        ) : (
          // Redirect lands here even if the webhook hasn't processed yet (browser redirect
          // fires immediately, webhook can lag a few seconds) — hence "processing", not "failed"
          <>
            <h1 className="bp-title" style={{margin: '0 auto 14px'}}>Processing your payment</h1>
            <p className="bp-prose" style={{margin: '0 auto'}}>
              This can take a few moments. Refresh this page shortly, or check your email —
              we&apos;ll send confirmation as soon as payment clears.
            </p>
          </>
        )}
      </div>
    </main>
  )
}
