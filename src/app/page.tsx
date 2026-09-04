import Link from 'next/link';
import Reveal2 from '../components/Reveal';
import ActivitiesCarousel from '../components/ActivitiesCarousel';
import {getUpcomingMonthlyBanners, urlFor} from '../lib/sanity';

export const revalidate = 60 // ISR: re-fetch from Sanity at most once a minute — without this,
// the homepage was fully static after the first deploy and never picked up new events/banners
// added in Studio afterward, which is exactly the bug this line fixes.

type MonthlyBannerCard = {
  _id: string
  month: string
  monthSlug: string
  bannerImage?: any
  tagline?: string
  events: {_id: string; title: string; slug: {current: string}; date: string; price: number}[]
}

export default async function Home() {
  const monthlyBanners: MonthlyBannerCard[] = await getUpcomingMonthlyBanners(3);

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
            SATA Gold Winner 2023 — Leading Adventure Sports Operator, South Asia
          </div>
          <h1>Chase Freedom. One Extreme Adventure at a Time.</h1>
          <p className="hero-sub body-lg">Abseil untouched waterfalls, raft wild rivers, and trek hidden trails across Sri Lanka — guided by experts who put your safety first.</p>
          <div className="hero-ctas">
            <a href="#activities" className="btn btn-primary">Explore Adventures</a>
            <a href="#" className="btn btn-ghost" id="showreelBtn">Watch Showreel</a>
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

          <ActivitiesCarousel/>

          <Reveal2 className="activities-cta"><a href="/experiences">See All Experiences →</a></Reveal2>
        </div>
      </section>

      <section className="events" id="events">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow">Fixed departures</span>
            <h2>Upcoming Adventures</h2>
            <p>Browse scheduled group departures over the next few months — pick a date, reserve your spot, and let us handle the logistics.</p>
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
                      <Link href={`/events/${banner.monthSlug}`} className="view-link">See More →</Link>
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
          <Reveal2 className="about-img">
            <img src="https://images.unsplash.com/photo-1550486686-a496af34a2d5?fm=jpg&q=70&w=1000&auto=format&fit=crop" alt="Ceylon Extreme Adventures guide team with travelers on a mountain summit" />
          </Reveal2>
          <Reveal2 className="about-text">
            <span className="eyebrow">Who we are</span>
            <h2>Adventure Is in Our Nature</h2>
            <p>We&apos;re a team of young adventure-sports professionals and naturalists dedicated to guiding you safely through Sri Lanka&apos;s hidden wonders — connecting you with nature and pushing your limits, one expedition at a time.</p>
            <div className="stat-strip">
              <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Adventures Led</span></div>
              <div className="stat"><span className="stat-num">98%</span><span className="stat-label">Recommend Us</span></div>
              <div className="stat"><span className="stat-num">10+</span><span className="stat-label">Years Experience</span></div>
              <div className="stat"><span className="stat-num">Gold</span><span className="stat-label">SATA Award 2023</span></div>
            </div>
          </Reveal2>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow" style={{ color: 'var(--rapids-blue)' }}>Reviews</span>
            <h2>Stories from the Trail</h2>
          </Reveal2>
          <div className="testi-scroller">
            <Reveal2 className="testi-card">
              <div className="stars">★★★★★</div>
              <p className="testi-quote">&quot;The instructors explained everything clearly and made sure we understood every safety step. Truly unforgettable.&quot;</p>
              <div className="testi-author">
                <div className="avatar"><img src="https://i.pravatar.cc/88?img=47" alt="" /></div>
                <div><div className="author-name">Anjali R.</div><div className="author-tag">Abseiling — Puna Ella</div></div>
              </div>
            </Reveal2>
            <Reveal2 className="testi-card">
              <div className="stars">★★★★★</div>
              <p className="testi-quote">&quot;Comfortable transport, good food, excellent safety gear — I felt taken care of the entire trip.&quot;</p>
              <div className="testi-author">
                <div className="avatar"><img src="https://i.pravatar.cc/88?img=12" alt="" /></div>
                <div><div className="author-name">Marc D.</div><div className="author-tag">Canyoning — Kitulgala</div></div>
              </div>
            </Reveal2>
            <Reveal2 className="testi-card">
              <div className="stars">★★★★★</div>
              <p className="testi-quote">&quot;Professionalism, friendliness, and safety focus made every moment of the rapids enjoyable.&quot;</p>
              <div className="testi-author">
                <div className="avatar"><img src="https://i.pravatar.cc/88?img=33" alt="" /></div>
                <div><div className="author-name">Sanjeewa P.</div><div className="author-tag">Rafting — Kelani River</div></div>
              </div>
            </Reveal2>
          </div>
        </div>
      </section>

      <section id="gallery">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow">@extremeadventures.lk</span>
            <h2>Moments of Freedom</h2>
          </Reveal2>
          <Reveal2 className="gallery-grid">
            <a href="#"><img src="https://images.unsplash.com/photo-1547233528-08a0fabc00dd?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Waterfall abseiling moment" /></a>
            <a href="#"><img src="https://images.unsplash.com/photo-1621693113354-8b32a9e0ba39?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Guide beside waterfall" /></a>
            <a href="#"><img src="https://images.unsplash.com/photo-1641584495089-5914d85d9bcc?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Group rafting" /></a>
            <a href="#"><img src="https://images.unsplash.com/photo-1629248564797-8c5ba85da9d3?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Kayaking on calm river" /></a>
            <a href="#"><img src="https://images.unsplash.com/photo-1708649290066-5f617003b93f?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Coral reef underwater" /></a>
            <a href="#"><img src="https://images.unsplash.com/photo-1756136720412-b03a99998672?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Misty mountain trek" /></a>
          </Reveal2>
          <Reveal2 className="gallery-cta"><a href="https://www.instagram.com/extremeadventures.lk/" className="btn btn-dark" target="_blank" rel="noopener">Follow @extremeadventures.lk →</a></Reveal2>
        </div>
      </section>

    </main>
  );
}
