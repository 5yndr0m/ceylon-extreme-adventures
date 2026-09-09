// src/app/events/[month]/[eventSlug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getEventBySlug, isEventBookable, urlFor} from '@/lib/sanity'
import EventBookingForm from './EventBookingForm'

export const revalidate = 60

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{month: string; eventSlug: string}>
}) {
  const {month, eventSlug} = await params
  const event = await getEventBySlug(eventSlug)
  if (!event) return notFound()

  const canBook = isEventBookable(event)
  const exp = event.experience

  // Only show remaining-slots info once at least one booking exists for THIS event —
  // bookedSlots is scoped by the exact event._id (see getEventBySlug), so a different
  // departure's bookings (same experience, other dates) never factor in here.
  const bookedSlots: number = event.bookedSlots ?? 0
  const remainingSlots =
    bookedSlots > 0 && typeof event.maxSlots === 'number' ? Math.max(0, event.maxSlots - bookedSlots) : null

  const dateLabel = new Date(event.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="bp-page">
      <div className="container bp-top">
        <div className="bp-breadcrumb">
          <Link href="/">Home</Link> / <Link href={`/events/${month}`}>Events</Link> / <span>{event.title}</span>
        </div>
        <h1 className="bp-title">{event.title}</h1>
        <div className="bp-subline">
          {exp?.category && <span className="bp-tag">{exp.category}</span>}
          <span className="bp-sub-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {dateLabel}
          </span>
          {event.durationDays && (
            <span className="bp-sub-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              {event.durationDays} {event.durationDays === 1 ? 'day' : 'days'}
            </span>
          )}
          {exp?.locationName && (
            <span className="bp-sub-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
              {exp.locationName}
            </span>
          )}
          {exp?.difficulty && (
            <span className="bp-sub-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
              {exp.difficulty}
            </span>
          )}
        </div>
      </div>

      <div className="container bp-grid">
        <div className="bp-main">
          <div className="bp-event-top">
            {event.flyerImage && (
              <div className="bp-flyer">
                <Image
                  src={urlFor(event.flyerImage).width(700).height(875).url()}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <div className="bp-event-top-details">
              <section className="bp-section">
                <h2>About this departure</h2>

                <div className="bp-facts-row">
                  <div className="bp-fact-pill">
                    <span className="bp-fact-pill-label">Date</span>
                    <span className="bp-fact-pill-value">{new Date(event.date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}</span>
                  </div>
                  <div className="bp-fact-pill">
                    <span className="bp-fact-pill-label">Duration</span>
                    <span className="bp-fact-pill-value">{event.durationDays ? `${event.durationDays} ${event.durationDays === 1 ? 'day' : 'days'}` : '—'}</span>
                  </div>
                  {exp?.maxGroupSize && (
                    <div className="bp-fact-pill">
                      <span className="bp-fact-pill-label">Group size</span>
                      <span className="bp-fact-pill-value">Up to {exp.maxGroupSize}</span>
                    </div>
                  )}
                  {exp?.difficulty && (
                    <div className="bp-fact-pill">
                      <span className="bp-fact-pill-label">Difficulty</span>
                      <span className="bp-fact-pill-value">{exp.difficulty}</span>
                    </div>
                  )}
                </div>

                <div className="bp-prose">
                  <p>{event.shortDescription || exp?.shortDescription || 'Full trip details coming soon — get in touch if you have questions before booking.'}</p>
                </div>
              </section>

              {event.includes && event.includes.length > 0 && (
                <section className="bp-section">
                  <h2>What&apos;s included</h2>
                  <div className="bp-tags">
                    {event.includes.map((item: string) => (
                      <span key={item} className="bp-activity-tag">{item}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {exp?.slug?.current && (
            <section className="bp-section">
              <h2>Want the full details?</h2>
              <p className="bp-prose" style={{marginBottom: 14}}>
                Reviews, photo gallery, quick facts, and the best months to go are all on the experience page.
              </p>
              <Link href={`/experiences/${exp.slug.current}`} className="btn btn-dark">
                Know about the experience
              </Link>
            </section>
          )}
        </div>

        <aside className="bp-book-col">
          <div className="bp-book-card">
            <div className="bp-book-price">
              <span className="bp-book-amount">LKR {event.price?.toLocaleString()}</span>
              <span className="bp-book-unit">per person</span>
            </div>
            <p className="bp-book-note" style={{marginTop: 0, marginBottom: 20}}>{dateLabel}</p>

            {!canBook ? (
              <p className="bp-form-error" style={{textAlign: 'center', background: 'var(--mist-white)', borderRadius: 8, padding: '14px'}}>
                Registration closed
              </p>
            ) : (
              <EventBookingForm eventId={event._id} remainingSlots={remainingSlots} />
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}
