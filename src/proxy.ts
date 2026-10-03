// src/proxy.ts
//
// Edge-level traffic filter, added after the Vercel account was suspended for a 300%
// spike in Edge Requests. The Vercel Observability dashboard (checked once the account
// was reachable again) identified the actual cause precisely: Meta's own `ai_crawler`
// bot category -- specifically `meta-externalagent` (35K requests) and `meta-webindexer`
// (4.6K) -- accounted for over 99% of all CDN requests in a 12h window, versus 125 for
// Googlebot, 8 for Bingbot, and 1 for facebookexternalhit (the actual Open Graph
// link-preview bot, which is NOT the problem and must stay allowed). The client-IP
// breakdown showed dozens of distinct IPs all in Meta's 57.141.24.x crawler range, and
// the hit routes included garbage paths unrelated to this site (a stray Amazon author
// URL, 25+ pages of fabricated "adventure-category-sitemap.xml/ca-*" variants) --
// speculative/guessed paths, not real links, each one still a billed edge request.
//
// Two layers, both deliberately conservative (false negatives over false positives --
// a missed bot costs nothing new, a blocked real visitor costs a booking):
//
// 1. User-Agent filtering: rejects Meta's AI-crawler family (the confirmed culprit),
//    other known AI-training crawlers and scraper/automation tool signatures (same list
//    as robots.txt's BLOCKED_BOTS, which is advisory-only and evidently not respected by
//    Meta's crawlers here -- they aren't even in that list yet, added below too). Real
//    browsers, Googlebot/Bingbot/Applebot, and facebookexternalhit/Twitterbot (needed for
//    Open Graph cards when someone actually shares a link to this site) are untouched --
//    this is a denylist, not an allowlist.
// 2. Per-IP sliding-window rate limit, same pattern already used in /api/bookings/route.ts.
//    Note this layer would NOT have caught this specific incident on its own -- the
//    busiest single IP in the breakdown made ~677 requests over 12 hours, far under any
//    reasonable per-minute threshold, because the crawling was spread across dozens of
//    IPs in the same range. It's kept as a second layer for a different failure mode
//    (one IP hammering the site), not as the fix for this one.
//
// Known limitation: the in-memory Map below is per edge isolate, not shared globally
// across Vercel's edge network -- a distributed source spread across many regions only
// gets throttled per-region, not in aggregate (exactly what made layer 2 insufficient
// here). The UA filter has no such limitation since it needs no shared state. A real fix
// for the rate-limit gap needs a shared store (Vercel Global Config, Upstash Redis,
// etc.) -- deliberately not added here without discussing the added cost/dependency first.
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

const BLOCKED_UA_PATTERNS = [
  // Confirmed cause of the Edge Requests suspension (2026-10-03) -- Meta's AI/crawling
  // bot family. Deliberately does NOT include facebookexternalhit (the real link-unfurl
  // bot) or Twitterbot/WhatsApp, which generate real Open Graph previews.
  /meta-externalagent/i,
  /meta-externalfetcher/i,
  /meta-webindexer/i,
  /facebookbot/i,
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /python-urllib/i,
  /scrapy/i,
  /go-http-client/i,
  /headlesschrome/i,
  /phantomjs/i,
  /^java\//i,
  /libwww-perl/i,
  /httpclient/i,
  /node-fetch/i,
  /axios\/\d/i,
  /okhttp/i,
  // Same SEO/AI-crawler denylist as robots.txt (src/app/robots.ts) -- kept in sync
  // manually since robots.txt can only ask politely and this can actually enforce it.
  /ahrefsbot/i,
  /semrushbot/i,
  /mj12bot/i,
  /dotbot/i,
  /blexbot/i,
  /dataforseobot/i,
  /serpstatbot/i,
  /megaindex/i,
  /zoominfobot/i,
  /bytespider/i,
  /petalbot/i,
  /gptbot/i,
  /ccbot/i,
  /claudebot/i,
  /claude-web/i,
]

const WINDOW_MS = 60_000
// Generous on purpose: a real visitor navigating between pages, each pulling its own
// RSC payload, shouldn't get near this within a minute. Tune down only with evidence.
const MAX_REQUESTS_PER_WINDOW = 90
const MAX_TRACKED_IPS = 5000

const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  timestamps.push(now)
  requestLog.set(ip, timestamps)

  if (requestLog.size > MAX_TRACKED_IPS) {
    for (const [key, hits] of requestLog) {
      if (hits.every((t) => now - t > WINDOW_MS)) requestLog.delete(key)
    }
  }

  return timestamps.length > MAX_REQUESTS_PER_WINDOW
}

export function proxy(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') ?? ''

  if (!userAgent || BLOCKED_UA_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse('Forbidden', {status: 403})
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || ''

  if (ip && isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', {status: 429, headers: {'Retry-After': '60'}})
  }

  return NextResponse.next()
}

// Skips static assets and the file-convention metadata routes entirely -- those are
// either immutably cached by the browser after the first load (_next/static) or need
// to stay reachable unconditionally (robots.txt, sitemap.xml) for crawlers that passed
// the UA check. Only page navigations and API calls go through the checks above.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|icon\\.png|apple-icon\\.png|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest).*)',
  ],
}

// TODO once the Vercel account/dashboard is reachable again: this file is a stopgap.
// Vercel's own Firewall (managed rulesets, rate limiting) and BotID (bot detection) run
// at the actual edge network level, shared across all regions, and would cover the
// distributed-scraper gap this file can't close. Check the Firewall tab before
// re-enabling the project and leaning on this file long-term.
