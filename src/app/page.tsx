import Link from 'next/link';
import Reveal2 from '../components/Reveal';
import ActivitiesCarousel from '../components/ActivitiesCarousel';
import FoundersSlider from '../components/FoundersSlider';
import Image from 'next/image';
import { getAllPosts, getFeaturedTestimonials, getUpcomingMonthlyBanners, urlFor } from '../lib/sanity';

export const revalidate = 60 // ISR: re-fetch from Sanity at most once a minute

type MonthlyBannerCard = {
  _id: string
  month: string
  monthSlug: string
  bannerImage?: any
  tagline?: string
  events: {_id: string; title: string; slug: {current: string}; date: string; price: number}[]
}

type PostSummary = {
  _id: string
  title: string
  slug: {current: string}
  category?: string
  excerpt?: string
  publishedAt: string
  image?: any
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
}

// Long reviews (some run 5+ paragraphs) blow out the fixed-height testimonial
// card layout — truncate and link out to the full review instead of showing
// it all inline. Only truncates when there's a sourceUrl to send people to;
// otherwise showing a "..." with nowhere to go is worse than just showing
// the full (short) quote.
const QUOTE_TRUNCATE_LENGTH = 220
function truncateQuote(quote: string, sourceUrl?: string) {
  if (!sourceUrl || quote.length <= QUOTE_TRUNCATE_LENGTH) {
    return {text: quote, truncated: false}
  }
  const cut = quote.slice(0, QUOTE_TRUNCATE_LENGTH)
  const lastSpace = cut.lastIndexOf(' ')
  return {text: cut.slice(0, lastSpace > 0 ? lastSpace : QUOTE_TRUNCATE_LENGTH) + '…', truncated: true}
}

function TestimonialCard({t}: {t: any}) {
  const {text, truncated} = truncateQuote(t.quote, t.sourceUrl)
  return (
    <div className="testi-card">
      <div className="stars">{'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}</div>
      <p className="testi-quote">
        &quot;{text}&quot;
        {truncated && (
          <>
            {' '}
            <a href={t.sourceUrl} target="_blank" rel="noopener" className="testi-read-more">
              Read full review
            </a>
          </>
        )}
      </p>
      <div className="testi-author">
        <div className="avatar">
          {t.photo ? (
            <Image
              src={urlFor(t.photo).width(88).height(88).url()}
              alt={t.customerName}
              width={44}
              height={44}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--jungle-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="#fff" fillOpacity="0.85" />
                <path
                  d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
                  stroke="#fff"
                  strokeOpacity="0.85"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
        <div>
          <div className="author-name">{t.customerName}</div>
          <div className="author-tag">
            {t.experience ? `${t.experience.title}${t.experience.locationName ? ` — ${t.experience.locationName}` : ''}` : t.source}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function Home() {
  const [testimonials, monthlyBanners, posts]: [any[], MonthlyBannerCard[], PostSummary[]] = await Promise.all([
    getFeaturedTestimonials(),
    getUpcomingMonthlyBanners(3),
    getAllPosts(),
  ]);
  const latestPosts = posts.slice(0, 3);
  return (
    <main>

      <section className="hero" id="top">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1547233528-08a0fabc00dd?fm=jpg&q=70&w=2200&auto=format&fit=crop" alt="Adventurer abseiling down a waterfall in Sri Lanka" />
          <div className="overlay"></div>
        </div>
        <div className="container hero-inner">
          <div className="hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" fill="#F2622E" /></svg>
            SATA Gold Winner 2023, 2024 &amp; 2025 — Leading Adventure Sports Operator, South Asia
          </div>
          <h1>Chase Freedom. One Extreme Adventure at a Time.</h1>
          <p className="hero-sub body-lg">Abseil untouched waterfalls, raft wild rivers, and trek hidden trails across Sri Lanka — guided by experts who put your safety first.</p>
          <div className="hero-ctas">
            <a href="#activities" className="btn btn-primary">Explore Adventures</a>
            <a
              href="https://www.youtube.com/@ceylonextremeadventures3799"
              className="btn btn-ghost"
              id="showreelBtn"
              target="_blank"
              rel="noopener"
            >
              Watch Showreel
            </a>
          </div>
        </div>
      </section>

      <section className="activities" id="activities">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow">What we run</span>
            <h2>Six Ways to Push Your Limits</h2>
            <p>Every trip is led by certified guides with full safety briefings, gear checks, and small group sizes.</p>
          </Reveal2>

          <ActivitiesCarousel />

          <Reveal2 className="activities-cta"><a href="/experiences">See All Experiences</a></Reveal2>
        </div>
      </section>

      <section className="events" id="events">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow">Fixed departures</span>
            <h2>Upcoming Adventures</h2>
            <p>Tap a month to browse every scheduled departure and reserve your spot.</p>
          </Reveal2>

          {monthlyBanners.length === 0 ? (
            <p className="events-empty">No upcoming departures posted yet — check back soon, or browse our <Link href="/experiences">experiences</Link> to plan your own dates.</p>
          ) : (
            <div className="months-grid">
              {monthlyBanners.map((banner) => {
                const monthLabel = new Date(banner.month).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'});
                const eventCount = banner.events?.length ?? 0;
                return (
                  <Reveal2 className="month-card" key={banner._id}>
                    <Link href={`/events/${banner.monthSlug}`} className="month-banner">
                      <img
                        src={urlFor(banner.bannerImage).width(700).height(875).url()}
                        alt={`${monthLabel} events`}
                      />
                    </Link>
                    <div className="month-details">
                      <h3>{monthLabel}</h3>
                      {banner.tagline && <p className="month-tagline">{banner.tagline}</p>}
                      <p className="month-count">{eventCount} {eventCount === 1 ? 'departure' : 'departures'} scheduled</p>
                      <Link href={`/events/${banner.monthSlug}`} className="view-link">See More</Link>
                    </div>
                  </Reveal2>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="about">
        <div className="container about-grid">
          <div className="about-founders">
            <FoundersSlider />
          </div>
            <div className="about-text">
              <span className="eyebrow">Who we are</span>
              <h2>Adventure Is in Our Nature</h2>
              <p>We&apos;re a team of young adventure-sports professionals and naturalists who love going to extreme lengths to explore the hidden wonders of Sri Lanka — guiding you safely on a journey of self-discovery, one expedition at a time.</p>
              <div className="stat-strip">
                <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Guided Down Laxapana</span></div>
                <div className="stat"><span className="stat-num">0</span><span className="stat-label">Injuries on Record</span></div>
                <div className="stat"><span className="stat-num">30+</span><span className="stat-label">Unique Adventures</span></div>
                <div className="stat"><span className="stat-num">Gold</span><span className="stat-label">SATA Award '23–'25</span></div>
              </div>
            </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow" style={{ color: 'var(--rapids-blue)' }}>Reviews</span>
            <h2>Stories from the Trail</h2>
          </Reveal2>
          {testimonials.length === 0 ? (
            <p style={{ color: 'var(--stone-gray)' }}>Reviews coming soon.</p>
          ) : (
            <div className="testi-marquee">
              {(['a', 'b'] as const).map((row) => (
                <div
                  key={row}
                  className={`testi-row testi-row-${row}`}
                  style={{'--testi-duration': `${Math.max(testimonials.length * 6, 24)}s`} as React.CSSProperties}
                >
                  {[...testimonials, ...testimonials].map((t: any, i: number) => (
                    <TestimonialCard key={`${row}-${t._id}-${i}`} t={t} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="blog-list" id="blog">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow">From the trail</span>
            <h2>Notes From The Trail</h2>
            <p>Trip-planning guides, company news, and beginner&apos;s advice from the guides who run these routes every week.</p>
          </Reveal2>
          {latestPosts.length === 0 ? (
            <p style={{ color: 'var(--stone-gray)' }}>No posts published yet — check back soon.</p>
          ) : (
            <>
              <Reveal2 className="blog-grid">
                {latestPosts.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug.current}`} className="blog-card">
                    <div className="blog-card-img">
                      {post.image ? (
                        <Image
                          src={urlFor(post.image).width(700).height(460).url()}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="blog-card-img-fallback" />
                      )}
                    </div>
                    <div className="blog-card-body">
                      {post.category && <span className="tag">{post.category}</span>}
                      <h3>{post.title}</h3>
                      {post.excerpt && <p>{post.excerpt}</p>}
                      <span className="blog-card-date">{formatDate(post.publishedAt)}</span>
                    </div>
                  </Link>
                ))}
              </Reveal2>
              <Reveal2 className="activities-cta"><Link href="/blog">Read More Stories</Link></Reveal2>
            </>
          )}
        </div>
      </section>

    </main>
  );
}