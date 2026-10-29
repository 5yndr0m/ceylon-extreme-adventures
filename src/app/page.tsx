import Link from 'next/link';
import Reveal2 from '../components/Reveal';
import ActivitiesCarousel from '../components/ActivitiesCarousel';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import FoundersSlider from '../components/FoundersSlider';
import HeroMedia from '../components/HeroMedia';
import Image from '@/components/SanityImage';
import { getAllPosts, getFeaturedTestimonials, getLeadershipProfiles, getUpcomingMonthlyBanners, urlFor, DEFAULT_HERO_IMAGE_URL } from '../lib/sanity';

const TRIPADVISOR_URL = 'https://www.tripadvisor.com/Attraction_Review-g304138-d26849088-Reviews-Ceylon_Extreme_Adventure_Pvt_Ltd-Kandy_Kandy_District_Central_Province.html'

// Looping hero background clip — a purpose-shot 28s montage (waterfall aerial, kayaking,
// abseiling, sunset paddle, hiking) with no on-screen text, so it needed no cropping/trimming,
// just muting + compression. Self-hosted as a Sanity file asset rather than committed to the
// repo, so it doesn't bloat the git history. Compressed harder than a first pass would
// suggest (1280x720, crf 27) since the hero's own dark gradient overlay sits on top of it —
// full 1080p/crf21 sharpness is wasted once that overlay darkens most of the frame.
const HERO_VIDEO_POSTER_URL = 'https://cdn.sanity.io/images/b5qf24u0/production/46954f34b5ab2329f047649049a22172cc2d8ecd-1280x720.jpg'
const HERO_VIDEO_URL = 'https://cdn.sanity.io/files/b5qf24u0/production/74e0b2b382fa75dd1a8a2758c928f2cd484872b4.webm'
const HERO_VIDEO_MP4_URL = 'https://cdn.sanity.io/files/b5qf24u0/production/0e9e83d7a28f720c31ae1fcc1275ecc3a149c38f.mp4'

export const revalidate = 60 // ISR: re-fetch from Sanity at most once a minute

type MonthlyBannerCard = {
  _id: string
  month: string
  monthSlug: string
  bannerImage?: any
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
  const [testimonials, monthlyBanners, posts, founders]: [any[], MonthlyBannerCard[], PostSummary[], any[]] = await Promise.all([
    getFeaturedTestimonials(),
    getUpcomingMonthlyBanners(3),
    getAllPosts(),
    getLeadershipProfiles(),
  ]);
  const latestPosts = posts.slice(0, 3);
  return (
    <main>

      <section className="hero" id="top">
        <HeroMedia posterUrl={HERO_VIDEO_POSTER_URL} videoUrl={HERO_VIDEO_URL} videoMp4Url={HERO_VIDEO_MP4_URL} />
        <div className="container hero-inner">
          <div className="hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" fill="var(--accent-on-dark)" /></svg>
            SOUTH ASIA'S SATA GOLD WINNER-2023, 2024 & 2025
          </div>
          <h1>
            <span className="hero-line"><span className="hero-line-inner">MORE THAN ADVENTURE.</span></span>
            <span className="hero-line"><span className="hero-line-inner">A JOURNEY OF GROWTH,</span></span>
            <span className="hero-line"><span className="hero-line-inner">CONFIDENCE AND DISCOVERY.</span></span>
          </h1>
          <p className="hero-sub body-lg">Discover Sri Lanka beyond the ordinary with Ceylon Extreme Adventures. From waterfall abseils and wild river expeditions to challenging mountain treks, every journey lets you explore nature and test your limits. Led by experienced professionals, our adventures are built on careful planning, responsible exploration and a strong commitment to safety.</p>
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
            <span className="eyebrow">OUR ADVENTURES</span>
            <h2>FIND YOUR NEXT ADVENTURE</h2>
            <p>Every trip is led by certified guides with full safety briefings, gear checks, and small group sizes.</p>
          </Reveal2>

          <ActivitiesCarousel />

          <Reveal2 className="activities-cta"><Link href="/experiences">See All Experiences</Link></Reveal2>
        </div>
      </section>

      <section className="events" id="events">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow">YOUR NEXT ADVENTURE STARTS HERE</span>
            <h2>Upcoming Adventures</h2>
            <p>Explore our upcoming adventure calendar and find your next experience in Sri Lanka. From challenging mountain hikes and waterfall abseiling to white-water rafting and wilderness expeditions, choose your adventure and reserve your slots.</p>
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
                      <Image
                        src={urlFor(banner.bannerImage).width(700).height(875).url()}
                        alt={`${monthLabel} events`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                    </Link>
                    <div className="month-details">
                      <h3>{monthLabel}</h3>
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
            <FoundersSlider founders={founders} />
          </div>
            <div className="about-text">
              <span className="eyebrow">THE PEOPLE BEHIND CEA</span>
              <h2>LEADERSHIP & EXPERTISE</h2>
              <p>Meet the people behind Ceylon Extreme Adventures, bringing together adventure leadership, technical knowledge and a shared commitment to meaningful outdoor experiences.</p>
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
          <p>Every adventure leaves a story. Discover what our guests have to say about their experiences with Ceylon Extreme Adventures.</p>
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
            <p>Explore Sri Lanka through practical trip-planning guides, local insights, adventure stories and expert advice from the people who know these trails best.</p>
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
              <Reveal2 className="activities-cta"><Link href="/blog">Explore All Articles</Link></Reveal2>
            </>
          )}
        </div>
      </section>

    </main>
  );
}
