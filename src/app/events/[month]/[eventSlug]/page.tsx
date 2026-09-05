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

  const dateLabel = new Date(event.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="bg-white min-h-screen">
      <div className="relative h-[45vh] w-full">
        {event.flyerImage && (
          <Image
            src={urlFor(event.flyerImage).width(1600).height(900).url()}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-7xl mx-auto">
          <p className="text-sm text-white/80 mb-2">
            <Link href="/" className="underline">Home</Link>
            {' / '}
            <Link href={`/events/${month}`} className="underline">Events</Link>
            {' / '}
            {event.title}
          </p>
          {event.experience?.category && (
            <p className="text-orange-400 text-sm uppercase tracking-wide mb-2">{event.experience.category}</p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold">{event.title}</h1>
          <p className="mt-2 text-white/90">
            {dateLabel}
            {event.durationDays && ` · ${event.durationDays} ${event.durationDays === 1 ? 'day' : 'days'}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {event.shortDescription && <p className="text-gray-700 text-lg">{event.shortDescription}</p>}

          {event.includes && event.includes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.includes.map((item: string) => (
                <span key={item} className="text-xs uppercase tracking-wide bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          )}

          {event.experience?.slug?.current && (
            <div className="border-t pt-6">
              <p className="text-sm text-gray-500 mb-2">
                Want to read more about this experience — reviews, photo gallery, and full details?
              </p>
              <Link
                href={`/experiences/${event.experience.slug.current}`}
                className="text-orange-600 font-semibold underline"
              >
                Know about the experience →
              </Link>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="border rounded-xl p-6 shadow-sm">
            <p className="text-2xl font-bold mb-1">LKR {event.price?.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mb-1">per person</p>
            <p className="text-sm text-gray-500 mb-6">{dateLabel}</p>

            {!canBook ? (
              <p className="text-center bg-gray-100 text-gray-600 rounded-full py-3 font-semibold">
                Registration closed
              </p>
            ) : (
              <EventBookingForm eventId={event._id} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
