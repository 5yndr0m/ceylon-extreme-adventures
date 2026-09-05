// src/lib/sanity.ts
import {createClient} from '@sanity/client'
import {createImageUrlBuilder} from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true, // fine for public read-only queries; listing/detail pages don't need fresh-write consistency
})

const builder = createImageUrlBuilder(client)
export function urlFor(source: any) {
  return builder.image(source)
}

// One row per experience card — keep this lean, listing pages don't need fullDescription.
// Excludes retired experiences: status != "retired" also matches docs where status was
// never set (older docs pre-dating this field), so nothing existing silently disappears —
// only experiences explicitly marked retired are filtered out.
export async function getAllExperiences() {
  return client.fetch(`
    *[_type == "experience" && status != "retired"] | order(title asc) {
      _id,
      title,
      slug,
      category,
      difficulty,
      durationHours,
      price,
      locationName,
      status,
      heroImage
    }
  `)
}

// Full detail for a single experience page — this is the "read about it, see reviews,
// browse the gallery" page. Booking happens on the events/flyer flow, not here, but we
// still surface upcoming scheduled departures as a convenience pointer into that flow.
export async function getExperienceBySlug(slug: string) {
  return client.fetch(
    `
    *[_type == "experience" && slug.current == $slug][0] {
      _id,
      title,
      category,
      difficulty,
      durationHours,
      price,
      locationName,
      distancesFrom,
      maxGroupSize,
      activityTags,
      status,
      shortDescription,
      fullDescription,
      quickFacts,
      suitableMonths,
      heroImage,
      gallery,
      guide->{name, photo, bio, phone},
      "testimonials": *[_type == "testimonial" && references(^._id)] | order(featured desc) {
        _id, customerName, quote, rating, source, photo
      },
      "upcomingEvents": *[_type == "event" && references(^._id) && date >= now() && registrationOpen == true] | order(date asc) {
        _id, title, slug, date, price
      }
    }
  `,
    {slug}
  )
}

// One row per blog card — publishedAt drives sort order, newest first
export async function getAllPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      category,
      excerpt,
      publishedAt,
      image
    }
  `)
}

// Full detail for a single blog post, plus the linked experience card (if any)
export async function getPostBySlug(slug: string) {
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      category,
      excerpt,
      publishedAt,
      image,
      body,
      relatedExperience->{title, slug, heroImage, price, category}
    }
  `,
    {slug}
  )
}

// ---------------------------------------------------------------------------------
// Events / monthly banners
//
// An "event" is a specific scheduled departure of an experience (e.g. the Sep 5
// Dolukanda Hike). A "monthlyEventBanner" is the single designed poster for a month
// (e.g. "September Events"). Which events belong to which month is resolved at query
// time by matching event.date against the banner's month — see monthlyEventBannerType.ts
// for why that's a query-time join rather than a manual reference list.
// ---------------------------------------------------------------------------------

// "2026-09" -> {start: "2026-09-01", end: "2026-10-01"}
//
// IMPORTANT: these are plain "YYYY-MM-DD" strings, not full ISO datetimes. GROQ compares
// strings lexicographically (character by character), and Sanity's `date` field type
// (used by monthlyEventBanner.month) stores just "2026-09-01" with no time component.
// A full ISO datetime like "2026-09-01T00:00:00.000Z" is a *longer* string that shares
// the same 10-character prefix — and in lexicographic comparison, a shorter string is
// always "less than" a longer string it's a prefix of, regardless of what it represents.
// That meant `month >= "2026-09-01T00:00:00.000Z"` was silently false for a banner dated
// exactly "2026-09-01", excluding the current month's banner entirely. Plain date strings
// compare correctly against both the date-only `month` field and the full-datetime
// `event.date` field (a datetime value on day X is always lexicographically >= "X" and
// < the next day's date-only boundary), so this format works for both queries below.
function monthRangeFromDate(date: Date) {
  const start = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1))
  const end = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 1))
  const fmt = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
  return {start: fmt(start), end: fmt(end)}
}

// URL-friendly identifier for a month, e.g. "2026-09" — used for the /events/[month] route
export function monthSlugFor(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthRangeFromSlug(monthSlug: string): {start: string; end: string} | null {
  const match = /^(\d{4})-(\d{2})$/.exec(monthSlug)
  if (!match) return null
  const year = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1
  if (Number.isNaN(year) || Number.isNaN(month) || month < 0 || month > 11) return null
  return monthRangeFromDate(new Date(Date.UTC(year, month, 1)))
}

type MonthlyBanner = {
  _id: string
  month: string
  bannerImage?: any
  tagline?: string
}

// Homepage: the next `limit` months that have a poster uploaded in Studio, each with
// its event count + a short preview list for the "details below the flyer" row.
export async function getUpcomingMonthlyBanners(limit = 3) {
  const {start: startOfThisMonth} = monthRangeFromDate(new Date())

  const banners: MonthlyBanner[] = await client.fetch(
    `*[_type == "monthlyEventBanner" && month >= $startOfThisMonth] | order(month asc) [0...$limit] {
      _id, month, bannerImage, tagline
    }`,
    {startOfThisMonth, limit}
  )

  return Promise.all(
    banners.map(async (banner) => {
      const {start, end} = monthRangeFromDate(new Date(banner.month))
      const events = await client.fetch(
        `*[_type == "event" && date >= $start && date < $end] | order(date asc) {
          _id, title, slug, date, price
        }`,
        {start, end}
      )
      return {...banner, monthSlug: monthSlugFor(new Date(banner.month)), events}
    })
  )
}

// The dedicated month page (client's "5 or 6 flyers, each like the second image" page).
// monthSlug is "YYYY-MM", e.g. "2026-09".
export async function getEventsForMonthSlug(monthSlug: string) {
  const range = monthRangeFromSlug(monthSlug)
  if (!range) return {banner: null, events: []}
  const {start, end} = range

  const [banner, events] = await Promise.all([
    client.fetch(
      `*[_type == "monthlyEventBanner" && month >= $start && month < $end][0]{
        _id, month, bannerImage, tagline
      }`,
      {start, end}
    ),
    client.fetch(
      `*[_type == "event" && date >= $start && date < $end] | order(date asc) {
        _id, title, slug, date, durationDays, price, flyerImage, includes, shortDescription,
        registrationOpen,
        experience->{title, slug, category}
      }`,
      {start, end}
    ),
  ])

  return {banner, events}
}

// Full detail for a single event — used by the booking API routes (to resolve the
// experience/price/date for an event-based booking) and by any dedicated event page.
export async function getEventBySlug(slug: string) {
  return client.fetch(
    `*[_type == "event" && slug.current == $slug][0]{
      _id, title, slug, date, durationDays, price, flyerImage, includes, shortDescription,
      registrationOpen,
      experience->{_id, title, slug, category, heroImage}
    }`,
    {slug}
  )
}

export async function getEventById(id: string) {
  return client.fetch(
    `*[_type == "event" && _id == $id][0]{
      _id, title, slug, date, durationDays, price, registrationOpen,
      experience->{_id, title, slug, category}
    }`,
    {id}
  )
}

// A departure is bookable if registration hasn't been manually turned off AND the date
// hasn't hit its automatic cutoff. Registration closes starting the day before the
// departure date, not just on the day itself — so there's always at least a full day's
// lead time to prepare. Both the API route and the two event pages use this same
// function so the "is this still bookable" logic can't drift out of sync between them.
export function isEventBookable(event: {date: string; registrationOpen?: boolean}): boolean {
  if (event.registrationOpen === false) return false

  // event.date is a plain "YYYY-MM-DD" string going forward, but events created before
  // the date field was switched from datetime to date may still store a full timestamp
  // (e.g. "2026-09-19T00:00:00.000Z") until they're re-saved in Studio — handle both.
  const eventDate = new Date(event.date.includes('T') ? event.date : `${event.date}T00:00:00Z`)
  const cutoff = new Date(eventDate)
  cutoff.setUTCDate(cutoff.getUTCDate() - 1) // registration closes starting the day before

  const today = new Date()
  const todayDateOnly = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))

  return todayDateOnly < cutoff
}
