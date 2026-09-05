import Reveal2 from '../components/Reveal';
//import MonthlyEventFlyers from '../components/MonthlyEventFlyers';
import ActivitiesCarousel from '../components/ActivitiesCarousel';
import FoundersSlider from '../components/FoundersSlider';
import Image from 'next/image';
import { getFeaturedTestimonials, urlFor } from '../lib/sanity';

export const revalidate = 60 // ISR: re-fetch testimonials from Sanity at most once a minute

export default async function Home() {
  const testimonials = await getFeaturedTestimonials();
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

          <Reveal2 className="activities-cta"><a href="/experiences">See All Experiences →</a></Reveal2>
        </div>
      </section>

      <section className="events" id="events">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow">Fixed departures</span>
            <h2>Upcoming Adventures</h2>
            <p>Tap a month to browse every scheduled departure and reserve your spot.</p>
          </Reveal2>

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
            <div className="testi-scroller">
              {testimonials.map((t: any) => (
                <Reveal2 className="testi-card" key={t._id}>
                  <div className="stars">{'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}</div>
                  <p className="testi-quote">&quot;{t.quote}&quot;</p>
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
                        <div style={{ width: '100%', height: '100%', background: 'var(--jungle-green)' }} />
                      )}
                    </div>
                    <div>
                      <div className="author-name">{t.customerName}</div>
                      <div className="author-tag">
                        {t.experience ? `${t.experience.title}${t.experience.locationName ? ` — ${t.experience.locationName}` : ''}` : t.source}
                      </div>
                    </div>
                  </div>
                </Reveal2>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="gallery">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow">@extremeadventures.lk</span>
            <h2>Moments of Freedom</h2>
          </Reveal2>
          <Reveal2 className="gallery-grid">
            <a href="https://www.instagram.com/extremeadventures.lk/" target="_blank" rel="noopener"><img src="https://images.unsplash.com/photo-1547233528-08a0fabc00dd?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Waterfall abseiling moment" /></a>
            <a href="https://www.instagram.com/extremeadventures.lk/" target="_blank" rel="noopener"><img src="https://images.unsplash.com/photo-1621693113354-8b32a9e0ba39?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Guide beside waterfall" /></a>
            <a href="https://www.instagram.com/extremeadventures.lk/" target="_blank" rel="noopener"><img src="https://images.unsplash.com/photo-1641584495089-5914d85d9bcc?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Group rafting" /></a>
            <a href="https://www.instagram.com/extremeadventures.lk/" target="_blank" rel="noopener"><img src="https://images.unsplash.com/photo-1629248564797-8c5ba85da9d3?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Kayaking on calm river" /></a>
            <a href="https://www.instagram.com/extremeadventures.lk/" target="_blank" rel="noopener"><img src="https://images.unsplash.com/photo-1708649290066-5f617003b93f?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Coral reef underwater" /></a>
            <a href="https://www.instagram.com/extremeadventures.lk/" target="_blank" rel="noopener"><img src="https://images.unsplash.com/photo-1756136720412-b03a99998672?fm=jpg&q=60&w=500&auto=format&fit=crop" alt="Misty mountain trek" /></a>
          </Reveal2>
          <Reveal2 className="gallery-cta"><a href="https://www.instagram.com/extremeadventures.lk/" className="btn btn-dark" target="_blank" rel="noopener">Follow @extremeadventures.lk →</a></Reveal2>
        </div>
      </section>

    </main>
  );
}