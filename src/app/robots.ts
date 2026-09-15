import type {MetadataRoute} from 'next'

// Bots with no upside for this business, blocked outright:
//  - SEO/marketing crawlers: third-party tools used by competitors and agencies to
//    analyze the site. They never send a real customer here, so blocking them costs
//    nothing in actual search visibility (that's Googlebot/Bingbot, both left alone
//    below) or in link-preview rendering (Facebook/WhatsApp/Twitter's bots are a
//    separate set, also left alone -- blocking those would break the Open Graph
//    preview cards).
//  - AI-training crawlers: scrape content to train models, not to send visitors.
//    Worth reconsidering if there's ever a reason to want AI assistants recommending
//    this business by name -- easy to just delete this block if so.
const BLOCKED_BOTS = [
  'AhrefsBot',
  'SemrushBot',
  'SemrushBot-SA',
  'MJ12bot',
  'DotBot',
  'BLEXBot',
  'DataForSeoBot',
  'SerpstatBot',
  'MegaIndex',
  'ZoominfoBot',
  'GPTBot',
  'ChatGPT-User',
  'CCBot',
  'ClaudeBot',
  'Claude-Web',
  'Google-Extended',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Sanity Studio isn't content, /api isn't a page, and /payment +
        // /booking-confirmed are transactional pages tied to a specific booking_id —
        // none of these are meant to show up in search results. The /experiences?
        // pattern blocks every category-filtered query-string variant of the listing
        // page (?category=Hiking, ?category=Rafting, etc.) without blocking the plain
        // /experiences page itself -- no reason for a crawler to index six near-
        // duplicate filtered views of the same content.
        disallow: ['/studio', '/api', '/payment', '/booking-confirmed', '/experiences?'],
      },
      ...BLOCKED_BOTS.map((userAgent) => ({userAgent, disallow: '/'})),
    ],
    sitemap: 'https://extremeadventure.lk/sitemap.xml',
  }
}
