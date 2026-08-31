import Reveal2 from '../components/Reveal';

export default function Home() {
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
            <a href="#" className="btn btn-ghost" id="showreelBtn">▶ Watch Showreel</a>
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

          <div className="card-scroller">
            <Reveal2 className="activity-card">
              <img src="https://images.unsplash.com/photo-1756136720412-b03a99998672?fm=jpg&q=70&w=900&auto=format&fit=crop" alt="Hikers on a misty mountain trail in Sri Lanka" />
              <div className="activity-card-content">
                <h3>Hiking</h3>
                <p>Trek scenic ridgelines and misty peaks with guides who know every hidden trail.</p>
              </div>
            </Reveal2>

            <Reveal2 className="activity-card">
              <img src="https://images.unsplash.com/photo-1621693113354-8b32a9e0ba39?fm=jpg&q=70&w=900&auto=format&fit=crop" alt="Traveler abseiling down a waterfall in Sri Lanka" />
              <div className="activity-card-content">
                <h3>Abseiling</h3>
                <p>Descend cascading waterfalls with full safety gear and expert instruction.</p>
              </div>
            </Reveal2>

            <Reveal2 className="activity-card">
              <img src="https://images.unsplash.com/photo-1641584495089-5914d85d9bcc?fm=jpg&q=70&w=900&auto=format&fit=crop" alt="Group rafting and kayaking down the Kelani River" />
              <div className="activity-card-content">
                <h3>Rafting &amp; Kayaking</h3>
                <p>Paddle through rapids and calm stretches alike on Sri Lanka's best rivers.</p>
              </div>
            </Reveal2>

            <Reveal2 className="activity-card">
              <img src="https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?fm=jpg&q=70&w=900&auto=format&fit=crop" alt="Campers with tents under the stars in the mountains" />
              <div className="activity-card-content">
                <h3>Trekking &amp; Camping</h3>
                <p>Multi-day treks with camp nights under the stars, far from the crowds.</p>
              </div>
            </Reveal2>

            <Reveal2 className="activity-card">
              <img src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?fm=jpg&q=70&w=900&auto=format&fit=crop" alt="Adventurers on a multi-day river expedition" />
              <div className="activity-card-content">
                <h3>River Expedition</h3>
                <p>Multi-day river journeys blending rapids, camping, and remote scenery.</p>
              </div>
            </Reveal2>

            <Reveal2 className="activity-card">
              <img src="https://images.unsplash.com/photo-1520962880247-cfaf541c8724?fm=jpg&q=70&w=900&auto=format&fit=crop" alt="Explorer navigating a dark cave with headlamp" />
              <div className="activity-card-content">
                <h3>Caving</h3>
                <p>Explore underground chambers and passages lit only by your headlamp.</p>
              </div>
            </Reveal2>
          </div>

          <Reveal2 className="activities-cta"><a href="/experiences">See All Experiences →</a></Reveal2>
        </div>
      </section>

      <section className="events" id="events">
        <div className="container">
          <Reveal2 className="section-head">
            <span className="eyebrow">Fixed departures</span>
            <h2>This Month&apos;s Adventures</h2>
            <p>Join a scheduled group departure — grab a seat, meet fellow adventurers, and let us handle the logistics.</p>
          </Reveal2>

          <Reveal2 className="events-month">August</Reveal2>

          <Reveal2 className="events-carousel-wrap">
            <button className="event-nav prev" id="eventPrev" aria-label="Previous event">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            <div className="events-carousel" id="eventsCarousel">
              <article className="event-card">
                <div className="event-card-img">
                  <img src="https://images.unsplash.com/photo-1756136720412-b03a99998672?fm=jpg&q=70&w=700&auto=format&fit=crop" alt="Hikers on the misty trail up Sri Pada" />
                  <span className="event-date"><span className="event-date-mon">AUG</span><span className="event-date-day">22</span></span>
                </div>
                <div className="event-card-body">
                  <span className="tag">Hiking</span>
                  <h3>Sri Pada Night Hike</h3>
                  <div className="event-price">25,100 LKR <small>/ person</small></div>
                  <ul className="event-includes">
                    <li>🍽️ Meals</li>
                    <li>🚐 Transport</li>
                    <li>📸 Photography</li>
                    <li>🎥 Drone Coverage</li>
                  </ul>
                  <a href="/contact" className="btn btn-primary">Reserve Spot →</a>
                </div>
              </article>

              <article className="event-card">
                <div className="event-card-img">
                  <img src="https://images.unsplash.com/photo-1641584495089-5914d85d9bcc?fm=jpg&q=70&w=700&auto=format&fit=crop" alt="Group white-water rafting on the Kelani River" />
                  <span className="event-date"><span className="event-date-mon">AUG</span><span className="event-date-day">29</span></span>
                </div>
                <div className="event-card-body">
                  <span className="tag">Rafting</span>
                  <h3>Kitulgala Rapids Run</h3>
                  <div className="event-price">9,800 LKR <small>/ person</small></div>
                  <ul className="event-includes">
                    <li>🦺 Safety Gear</li>
                    <li>🚐 Transport</li>
                    <li>🍽️ Lunch</li>
                    <li>📸 Photography</li>
                  </ul>
                  <a href="/payment" className="btn btn-primary">Reserve Spot →</a>
                </div>
              </article>

              <article className="event-card">
                <div className="event-card-img">
                  <img src="https://images.unsplash.com/photo-1650911563224-0c843a6d843e?fm=jpg&q=70&w=700&auto=format&fit=crop" alt="Adventurer canyoning through a gorge in Ella" />
                  <span className="event-date"><span className="event-date-mon">SEP</span><span className="event-date-day">05</span></span>
                </div>
                <div className="event-card-body">
                  <span className="tag">Canyoning</span>
                  <h3>Ella Gorge Canyoning</h3>
                  <div className="event-price">12,500 LKR <small>/ person</small></div>
                  <ul className="event-includes">
                    <li>🦺 Safety Gear</li>
                    <li>🚐 Transport</li>
                    <li>🍽️ Snacks</li>
                    <li>🎥 Drone Coverage</li>
                  </ul>
                  <a href="/contact" className="btn btn-primary">Reserve Spot →</a>
                </div>
              </article>
            </div>

            <button className="event-nav next" id="eventNext" aria-label="Next event">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </Reveal2>
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