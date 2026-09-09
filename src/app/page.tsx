import Link from 'next/link';
import Reveal2 from '../components/Reveal';
import ActivitiesCarousel from '../components/ActivitiesCarousel';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import FoundersSlider from '../components/FoundersSlider';
import Image from 'next/image';
import { getAllPosts, getFeaturedTestimonials, getUpcomingMonthlyBanners, urlFor } from '../lib/sanity';

const TRIPADVISOR_URL = 'https://www.tripadvisor.com/Attraction_Review-g304138-d26849088-Reviews-Ceylon_Extreme_Adventure_Pvt_Ltd-Kandy_Kandy_District_Central_Province.html'

// Looping hero background clip — a purpose-shot 28s montage (waterfall aerial, kayaking,
// abseiling, sunset paddle, hiking) with no on-screen text, so it needed no cropping/trimming,
// just muting + compression. Self-hosted as a Sanity file asset rather than committed to the
// repo, so it doesn't bloat the git history. Compressed harder than a first pass would
// suggest (1280x720, crf 27) since the hero's own dark gradient overlay sits on top of it —
// full 1080p/crf21 sharpness is wasted once that overlay darkens most of the frame.
const HERO_VIDEO_URL = 'https://cdn.sanity.io/files/b5qf24u0/production/c291dca1daf761ac57c163e1ed1bf5357f72e8b9.mp4'
const HERO_POSTER_URL = 'https://cdn.sanity.io/images/b5qf24u0/production/d1879051ce34ad0b11b684706bc4df69242c945d-1280x720.jpg'

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
        <div className="hero-bg" style={{backgroundImage: `url(${HERO_POSTER_URL})`}}>
          <video autoPlay muted loop playsInline preload="auto" poster={HERO_POSTER_URL} aria-hidden="true">
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
          <div className="overlay"></div>
        </div>
        <div className="container hero-inner">
          <div className="hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" fill="#F2622E" /></svg>
            SATA Gold Winner 2023, 2024 &amp; 2025 — Leading Adventure Sports Operator, South Asia
          </div>
          <h1>
            <span className="hero-line"><span className="hero-line-inner">Chase Freedom.</span></span>
            <span className="hero-line"><span className="hero-line-inner">One Extreme Adventure</span></span>
            <span className="hero-line"><span className="hero-line-inner">at a Time.</span></span>
          </h1>
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
          <TestimonialsCarousel testimonials={testimonials} />
          <Reveal2 className="activities-cta">
            <a href={TRIPADVISOR_URL} target="_blank" rel="noopener">View More Reviews</a>
          </Reveal2>
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