
import Reveal from '../../components/Reveal';


export default function About() {
  return (
    <main>
      
{/* ================= PAGE HERO ================= */}
<section className="page-hero">
  <div className="page-hero-bg">
    <img src="https://images.unsplash.com/photo-1629248564797-8c5ba85da9d3?fm=jpg&q=70&w=2200&auto=format&fit=crop" alt="Ceylon Extreme Adventures guides kayaking on a Sri Lankan river" />
    <div className="overlay"></div>
  </div>
  <div className="container page-hero-inner">
    <div className="breadcrumb"><a href="/">Home</a> / <span>About Us</span></div>
    <span className="eyebrow" style={{color: 'var(--adrenaline-orange)'}}>Our story</span>
    <h1>Freedom Is Built On Trust</h1>
    <p className="page-hero-sub body-lg">Ten years and 500+ adventures in, we're still the same crew that started it: local guides who'd rather turn a client away than take a shortcut with their safety.</p>
  </div>
</section>

{/* ================= STORY ================= */}
<section id="story">
  <div className="container about-grid">
    <Reveal className="about-img">
      <img src="https://images.unsplash.com/photo-1621693113354-8b32a9e0ba39?fm=jpg&q=70&w=1000&auto=format&fit=crop" alt="Ceylon Extreme Adventures guide beside a waterfall" />
    </Reveal>
    <Reveal className="about-text">
      <span className="eyebrow">Who we are</span>
      <h2>From One Waterfall To A Nationwide Crew</h2>
      <p>Ceylon Extreme Adventures started with a handful of guides and one abseil line at Puna Ella, tired of watching visitors get sold "extreme" experiences by operators with no rescue plan and no local knowledge of the rock or the river.</p>
      <p>Today we run waterfall abseiling, canyoning, white-water rafting, hiking, kayaking and diving across Sri Lanka&apos;s wet zone and highlands — but the standard hasn&apos;t moved: every route is one our guides have run themselves, every group gets a safety briefing before a single carabiner clips on, and every itinerary is built around your group, not a fixed script.</p>
      <div className="stat-strip">
        <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Adventures Led</span></div>
        <div className="stat"><span className="stat-num">98%</span><span className="stat-label">Recommend Us</span></div>
        <div className="stat"><span className="stat-num">10+</span><span className="stat-label">Years Experience</span></div>
        <div className="stat"><span className="stat-num">Gold</span><span className="stat-label">SATA Award 2023</span></div>
      </div>
    </Reveal>
  </div>
</section>

{/* ================= VALUES ================= */}
<section className="values" id="values">
  <div className="container">
    <Reveal className="section-head">
      <span className="eyebrow">What we stand for</span>
      <h2>Three Rules We Don't Bend</h2>
    </Reveal>
    <div className="values-grid">
      <Reveal className="value-card">
        <div className="value-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F2622E" strokeWidth="2"><path d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h3>Safety First, Always</h3>
        <p>Certified guides, maintained gear, and a hard stop on any activity if conditions turn. We&apos;d rather reschedule than risk it.</p>
      </Reveal>
      <Reveal className="value-card">
        <div className="value-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F2622E" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </div>
        <h3>Local, Not Franchised</h3>
        <p>Every guide grew up near the rivers and cliffs they lead you through. You&apos;re getting their trails, not a tour-company script.</p>
      </Reveal>
      <Reveal className="value-card">
        <div className="value-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F2622E" strokeWidth="2"><path d="M12 21c-4.4-2.8-8-6.2-8-10.5A5.5 5.5 0 0 1 9.5 5c1 0 2 .4 2.5 1.1C12.5 5.4 13.5 5 14.5 5A5.5 5.5 0 0 1 20 10.5C20 14.8 16.4 18.2 12 21z"/></svg>
        </div>
        <h3>Built Around Your Group</h3>
        <p>First-timers, families, or seasoned climbers — pace, route, and briefing are matched to the people actually showing up.</p>
      </Reveal>
    </div>
  </div>
</section>

{/* ================= TEAM ================= */}
<section id="team">
  <div className="container">
    <Reveal className="section-head">
      <span className="eyebrow">Meet the crew</span>
      <h2>The Guides Behind The Ropes</h2>
      <p>A small team of certified instructors, river guides and dive masters — most of them with a decade or more on Sri Lanka&apos;s trails and rapids.</p>
    </Reveal>
    <div className="team-scroller">
      <Reveal className="team-card">
        <div className="team-photo"><img src="https://i.pravatar.cc/400?img=51" alt="Founder and lead guide" /></div>
        <div className="team-info">
          <h3>Kasun Perera</h3>
          <span className="team-role">Founder &amp; Lead Guide</span>
          <p>Started the company in 2016 with one abseil line at Puna Ella. IRATA-certified rope access technician.</p>
        </div>
      </Reveal>
      <Reveal className="team-card">
        <div className="team-photo"><img src="https://i.pravatar.cc/400?img=32" alt="Head of safety and canyoning lead" /></div>
        <div className="team-info">
          <h3>Dilani Fernando</h3>
          <span className="team-role">Head of Safety</span>
          <p>Runs every guide&apos;s rescue-drill recertification and signs off on route conditions before groups head out.</p>
        </div>
      </Reveal>
      <Reveal className="team-card">
        <div className="team-photo"><img src="https://i.pravatar.cc/400?img=14" alt="White-water rafting lead guide" /></div>
        <div className="team-info">
          <h3>Nadun Silva</h3>
          <span className="team-role">Rafting Lead, Kelani River</span>
          <p>Swiftwater rescue certified with 12 years reading the Kelani's grade II–III rapids in every season.</p>
        </div>
      </Reveal>
      <Reveal className="team-card">
        <div className="team-photo"><img src="https://i.pravatar.cc/400?img=25" alt="Dive master" /></div>
        <div className="team-info">
          <h3>Ishara Jayasuriya</h3>
          <span className="team-role">PADI Dive Master</span>
          <p>Leads our coastal snorkeling and diving trips, with a soft spot for training nervous first-time divers.</p>
        </div>
      </Reveal>
    </div>
  </div>
</section>

{/* ================= SAFETY / CREDENTIALS ================= */}
<section className="safety" id="safety">
  <div className="container safety-grid">
    <Reveal className="safety-info">
      <span className="eyebrow">Why groups trust us</span>
      <h2>Certified. Insured. Accountable.</h2>
      <p className="body-lg" style={{color: 'var(--stone-gray)', marginTop: '16px'}}>Every guide on our team is certified for the activity they lead, every trip carries participant insurance, and every route has a documented rescue plan on file before a group sets out.</p>
      <div className="badge-row">
        <span className="badge-pill">🏆 SATA Gold Award 2023</span>
        <span className="badge-pill">🪢 IRATA Rope Access Certified</span>
        <span className="badge-pill">🌊 Swiftwater Rescue Trained</span>
        <span className="badge-pill">🤿 PADI Dive Masters</span>
      </div>
    </Reveal>
    <Reveal className="safety-list">
      <div className="safety-item">
        <span className="num">01</span>
        <div><h3>Briefed Before You Move</h3><p>Every group gets a full safety and technique briefing at the site — no exceptions, no shortcuts.</p></div>
      </div>
      <div className="safety-item">
        <span className="num">02</span>
        <div><h3>Gear Checked Daily</h3><p>Ropes, harnesses and rafts are inspected before every single trip, not on a rolling schedule.</p></div>
      </div>
      <div className="safety-item">
        <span className="num">03</span>
        <div><h3>Weather Calls Made Early</h3><p>We reschedule rather than run a route in conditions our guides haven&apos;t cleared.</p></div>
      </div>
    </Reveal>
  </div>
</section>

{/* ================= CTA ================= */}
<section className="about-cta">
  <div className="container">
    <span className="eyebrow">Ready when you are</span>
    <h2>Come Meet The Crew In Person</h2>
    <p className="body-lg">Tell us your dates and group size, and we&apos;ll match you with the right guide and the right river, gorge, or trail.</p>
    <div className="ctas">
      <a href="/contact" className="btn btn-primary">Plan Your Adventure</a>
      <a href="/#activities" className="btn btn-ghost">See All Experiences</a>
    </div>
  </div>
</section>

    </main>
  );
}
