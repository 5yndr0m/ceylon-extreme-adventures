// src/app/api/bookings/route.ts
import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@sanity/client'
import {isEventBookable} from '@/lib/sanity'

// Separate client with a write token — never expose this token to the browser,
// this only runs server-side inside the API route
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// In-memory sliding-window rate limit, keyed by IP — no Redis/Upstash in this project,
// so this is a pragmatic stopgap rather than a proper distributed limiter: it only
// tracks requests seen by the current warm serverless instance and resets on cold
// start/redeploy, so it won't catch a determined/distributed attacker. It does stop
// the easy case (one script hammering this endpoint), which is the actual risk today —
// revisit with Upstash/Vercel KV if real abuse shows up.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5
const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  requestLog.set(ip, timestamps)
  return timestamps.length > RATE_LIMIT_MAX
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({error: 'Too many requests — please try again later'}, {status: 429})
  }

  const body = await req.json()

  const {eventId, experienceId, preferredDate} = body
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!fullName || !email) {
    return NextResponse.json({error: 'Missing required fields'}, {status: 400})
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({error: 'Invalid email address'}, {status: 400})
  }

  // groupSize defaults to 1 (matches the booking form's own minimum) rather than being
  // silently coerced from a bad value — reject anything that isn't a real positive integer
  // instead of letting 0/negative/non-numeric values reach Sanity or the PayHere amount calc.
  const groupSize = body.groupSize === undefined || body.groupSize === null || body.groupSize === '' ? 1 : Number(body.groupSize)
  if (!Number.isInteger(groupSize) || groupSize < 1) {
    return NextResponse.json({error: 'Group size must be a positive whole number'}, {status: 400})
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
        experience?: {_id: string}
      } | null>(
        `*[_type == "event" && _id == $eventId][0]{_id, date, registrationOpen, experience->{_id}}`,
        {eventId}
      )

      if (!event) {
        return NextResponse.json({error: 'Event not found'}, {status: 404})
      }
      // Re-checked here server-side, not just trusted from what the page rendered —
      // registration can close (day-before cutoff or manual toggle) between page load
      // and form submit
      if (!isEventBookable(event)) {
        return NextResponse.json({error: 'Registration is closed for this event'}, {status: 400})
      }
      if (!event.experience?._id) {
        return NextResponse.json({error: 'Event is not linked to an experience'}, {status: 400})
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
