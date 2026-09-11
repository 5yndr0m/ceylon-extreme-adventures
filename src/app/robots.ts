import type {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Sanity Studio isn't content, /api isn't a page, and /payment + /booking-confirmed
      // are transactional pages tied to a specific booking_id — none of these are meant
      // to show up in search results.
      disallow: ['/studio', '/api', '/payment', '/booking-confirmed'],
    },
    sitemap: 'https://extremeadventure.lk/sitemap.xml',
  }
}
