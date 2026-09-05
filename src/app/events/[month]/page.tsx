// src/app/events/[month]/page.tsx
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getEventsForMonthSlug, isEventBookable, urlFor} from '@/lib/sanity'

export const revalidate = 60

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})
}

type MonthEvent = {
  _id: string
  title: string
  slug: {current: string}
  date: string
  durationDays?: number
  price: number
  flyerImage?: any
  includes?: string[]
  shortDescription?: string
  registrationOpen?: boolean
  experience?: {title: string; slug: {current: string}; category?: string}
}

export default async function MonthEventsPage({
  params,
}: {
  params: Promise<{month: string}>
}) {
  const {month} = await params
  const {banner, events}: {banner: any; events: MonthEvent[]} = await getEventsForMonthSlug(month)

  // A malformed slug (not "YYYY-MM") gets nothing back from either query — that's a
  // genuine 404. A valid slug with no banner/events yet is just an empty month, not
  // a broken URL, so that renders an empty state below instead.
  if (!/^\d{4}-\d{2}$/.test(month)) return notFound()

  const monthLabel = banner
    ? new Date(banner.month).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})
    : (() => {
        const [year, m] = month.split('-')
        return new Date(Number(year), Number(m) - 1, 1).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})
      })()

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-bg">
          {banner?.bannerImage ? (
            <img src={urlFor(banner.bannerImage).width(2200).height(1400).url()} alt={`${monthLabel} events`} />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?fm=jpg&q=70&w=2200&auto=format&fit=crop"
              alt=""
            />
          )}
          <div className="overlay"></div>
        </div>
        <div className="container page-hero-inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/#events">Upcoming Adventures</Link> / <span>{monthLabel}</span>
          </div>
          <span className="eyebrow" style={{color: 'var(--adrenaline-orange)'}}>{events.length} scheduled {events.length === 1 ? 'departure' : 'departures'}</span>
          <h1>{monthLabel}</h1>
          {banner?.tagline && <p className="page-hero-sub body-lg">{banner.tagline}</p>}
        </div>
      </section>

      <section className="events">
        <div className="container">
          {events.length === 0 ? (
            <p className="events-empty">
              No departures scheduled for {monthLabel} yet — check <Link href="/#events">upcoming months</Link>, or{' '}
              <Link href="/contact">get in touch</Link> to arrange a custom date.
            </p>
          ) : (
            <div className="month-events-grid">
              {events.map((event) => (
                <article className="event-card" key={event._id}>
                  <div className="event-card-img">
                    {event.flyerImage && (
                      <img src={urlFor(event.flyerImage).width(700).height(525).url()} alt={event.title} />
                    )}
                    <span className="event-date">
                      <span className="event-date-mon">{formatDate(event.date).split(' ')[1]}</span>
                      <span className="event-date-day">{formatDate(event.date).split(' ')[0]}</span>
                    </span>
                  </div>
                  <div className="event-card-body">
                    {event.experience?.category && <span className="tag">{event.experience.category}</span>}
                    <h3>{event.title}</h3>
                    <div className="event-price">
                      LKR {event.price?.toLocaleString()} <small>/ person</small>
                      {event.durationDays && (
                        <small> · {event.durationDays} {event.durationDays === 1 ? 'day' : 'days'}</small>
                      )}
                    </div>
                    {event.includes && event.includes.length > 0 && (
                      <ul className="event-includes">
                        {event.includes.map((item: string) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {event.shortDescription && <p style={{fontSize: 13, color: 'var(--stone-gray)'}}>{event.shortDescription}</p>}
                    <div className="event-card-links">
                      {event.experience?.slug?.current && (
                        <Link href={`/experiences/${event.experience.slug.current}`} className="view-link">
                          Know about the experience →
                        </Link>
                      )}
                      {isEventBookable(event) ? (
                        <Link href={`/events/${month}/${event.slug.current}`} className="btn btn-primary">
                          Reserve Spot →
                        </Link>
                      ) : (
                        <span className="view-link" style={{color: 'var(--stone-gray)'}}>Registration closed</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
