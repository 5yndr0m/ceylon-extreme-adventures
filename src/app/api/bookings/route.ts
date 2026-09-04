// src/app/api/bookings/route.ts
import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@sanity/client'

// Separate client with a write token — never expose this token to the browser,
// this only runs server-side inside the API route
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {eventId, experienceId, fullName, email, phone, preferredDate, groupSize, message} = body

  if (!fullName || !email) {
    return NextResponse.json({error: 'Missing required fields'}, {status: 400})
  }

  try {
    let resolvedExperienceId = experienceId
    let resolvedPreferredDate = preferredDate

    // Booking from an event flyer: the departure date is fixed by the event, not
    // chosen by the customer, and the experience is derived from it rather than
    // passed directly — this is the primary booking flow per the client's events page.
    if (eventId) {
      const event = await sanity.fetch<{
        _id: string
        date: string
        registrationOpen: boolean
        maxParticipants?: number
        experience?: {_id: string}
      } | null>(
        `*[_type == "event" && _id == $eventId][0]{_id, date, registrationOpen, maxParticipants, experience->{_id}}`,
        {eventId}
      )

      if (!event) {
        return NextResponse.json({error: 'Event not found'}, {status: 404})
      }
      if (event.registrationOpen === false) {
        return NextResponse.json({error: 'Registration is closed for this event'}, {status: 400})
      }
      if (!event.experience?._id) {
        return NextResponse.json({error: 'Event is not linked to an experience'}, {status: 400})
      }

      if (event.maxParticipants) {
        const bookedCount = await sanity.fetch<number>(
          `count(*[_type == "booking" && event._ref == $eventId && paymentStatus != "Failed"])`,
          {eventId}
        )
        const requested = Number(groupSize) || 1
        if (bookedCount + requested > event.maxParticipants) {
          return NextResponse.json({error: 'Not enough spots remaining for this event'}, {status: 400})
        }
      }

      resolvedExperienceId = event.experience._id
      resolvedPreferredDate = event.date
    }

    // Minimal server-side validation — don't trust the client form alone
    if (!resolvedExperienceId || !resolvedPreferredDate) {
      return NextResponse.json({error: 'Missing required fields'}, {status: 400})
    }

    const booking = await sanity.create({
      _type: 'booking',
      experience: {_type: 'reference', _ref: resolvedExperienceId},
      ...(eventId ? {event: {_type: 'reference', _ref: eventId}} : {}),
      fullName,
      email,
      phone,
      preferredDate: resolvedPreferredDate,
      groupSize,
      message,
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({success: true, bookingId: booking._id})
  } catch (err) {
    console.error(err)
    return NextResponse.json({error: 'Failed to create booking'}, {status: 500})
  }
}
