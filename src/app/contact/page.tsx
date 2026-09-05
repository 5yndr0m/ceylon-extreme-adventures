'use client';

import Reveal from '../../components/Reveal';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thanks — this is a demo form, not yet connected to a backend.');
  };

  const handleFaqClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const item = e.currentTarget.closest('.faq-item');
    if (!item) return;

    const wasOpen = item.classList.contains('open');

    document
      .querySelectorAll('.faq-item.open')
      .forEach((i) => i.classList.remove('open'));

    if (!wasOpen) {
      item.classList.add('open');
    }
  };

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1708649290066-5f617003b93f?fm=jpg&q=70&w=2200&auto=format&fit=crop"
            alt="Contact Ceylon Extreme Adventures"
          />
          <div className="overlay"></div>
        </div>
        <div className="container page-hero-inner">
          <div className="breadcrumb">
            <a href="/">Home</a> / <span>Contact Us</span>
          </div>
          <span
            className="eyebrow"
            style={{ color: 'var(--adrenaline-orange)' }}
          >
            Let&apos;s plan it
          </span>
          <h1>Get In Touch</h1>
          <p className="page-hero-sub body-lg">
            Call, WhatsApp, or send an enquiry — tell us your dates, group
            size, and experience level, and we&apos;ll build the itinerary
            around you.
          </p>
        </div>
      </section>

      <section className="quick-contact">
        <div className="container">
          <div className="quick-grid">
            <Reveal className="quick-card">
              <div className="quick-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1L6.6 10.8z"
                    fill="#F2622E"
                  />
                </svg>
              </div>
              <div>
                <h3>Call or WhatsApp</h3>
                <p>
                  Fastest way to reach us, especially for last-minute dates.
                </p>
                <a href="tel:+94707900700" className="quick-link">
                  +94 707 900 700 / +94 707 900 701 →
                </a>
              </div>
            </Reveal>

            <Reveal className="quick-card">
              <div className="quick-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F2622E"
                  strokeWidth="2"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>
              <div>
                <h3>Email Us</h3>
                <p>
                  Best for group bookings, custom itineraries, and invoicing.
                </p>
                <a
                  href="mailto:sales@extremeadventure.lk"
                  className="quick-link"
                >
                  sales@extremeadventure.lk →
                </a>
              </div>
            </Reveal>

            <Reveal className="quick-card">
              <div className="quick-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F2622E"
                  strokeWidth="2"
                >
                  <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>
              <div>
                <h3>Visit Our Office</h3>
                <p>
                  Drop by to talk through routes, gear, or group logistics in
                  person.
                </p>
                <a href="#location" className="quick-link">
                  93/A, Madiwala Rd, Embuldeniya, Nugegoda →
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="booking" id="enquiry">
        <div className="container">
          <div className="booking-grid">
            <Reveal className="booking-info">
              <span className="eyebrow">Send an enquiry</span>
              <h2>Plan Your Next Adventure</h2>
              <p>
                Fill this in with as much detail as you have — dates, group
                size, experience level — and our team will reply within one
                business day with options and pricing.
              </p>

              <div className="contact-line">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1L6.6 10.8z"
                    fill="#F2622E"
                  />
                </svg>
                Call +94 707 900 700 / +94 707 900 701 or WhatsApp us
              </div>

              <div className="hours-list">
                <div className="hours-row">
                  <span>Monday – Friday</span>
                  <span>7:00 AM – 7:00 PM</span>
                </div>
                <div className="hours-row">
                  <span>Saturday – Sunday</span>
                  <span>6:00 AM – 7:00 PM</span>
                </div>
                <div className="hours-row">
                  <span>Public Holidays</span>
                  <span>By arrangement</span>
                </div>
              </div>
            </Reveal>

            <Reveal className="booking-form">
              <form onSubmit={handleSubmit}>
                <div className="field-row two">
                  <div>
                    <label htmlFor="fname">Full Name</label>
                    <input
                      id="fname"
                      type="text"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="femail">Email</label>
                    <input
                      id="femail"
                      type="email"
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="field-row two">
                  <div>
                    <label htmlFor="fphone">Phone</label>
                    <input
                      id="fphone"
                      type="tel"
                      placeholder="+94 7X XXX XXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="fdate">Preferred Date</label>
                    <input
                      id="fdate"
                      type="text"
                      placeholder="DD / MM / YYYY"
                    />
                  </div>
                </div>

                <div className="field-row two">
                  <div>
                    <label htmlFor="factivity">Activity</label>
                    <select id="factivity">
                      <option value="">Select an experience</option>
                      <option>Waterfall Abseiling</option>
                      <option>Canyoning</option>
                      <option>White-Water Rafting</option>
                      <option>Hiking &amp; Trekking</option>
                      <option>Kayaking</option>
                      <option>Snorkeling &amp; Diving</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="fgroup">Group Size</label>
                    <input
                      id="fgroup"
                      type="number"
                      min="1"
                      placeholder="e.g. 6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="fmessage">Message</label>
                  <textarea
                    id="fmessage"
                    placeholder="Tell us about your experience level, or any questions"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Enquiry
                </button>
                <p className="form-note">
                  We reply within one business day. For urgent or same-day
                  bookings, please call or WhatsApp.
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="map-section" id="location">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Find us</span>
            <h2>Our Office</h2>
            <p>
              Based in Nugegoda, a short drive from central Colombo — walk-ins
              welcome during office hours.
            </p>
          </Reveal>

          <Reveal className="map-wrap">
            <iframe
              src="https://www.google.com/maps?q=Nugegoda,Sri%20Lanka&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ceylon Extreme Adventures office location"
            ></iframe>
          </Reveal>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Before you reach out</span>
            <h2>Quick Answers</h2>
          </Reveal>

          <div className="faq-list">
            <Reveal className="faq-item">
              <button className="faq-q" onClick={handleFaqClick}>
                How fast do you reply to enquiries?
                <span className="plus">+</span>
              </button>
              <div className="faq-a">
                <p>
                  Within one business day for email and form enquiries. Call
                  or WhatsApp for anything same-day or urgent.
                </p>
              </div>
            </Reveal>

            <Reveal className="faq-item">
              <button className="faq-q" onClick={handleFaqClick}>
                Do you need a deposit to confirm a booking?
                <span className="plus">+</span>
              </button>
              <div className="faq-a">
                <p>
                  Yes, a deposit secures your date once we&apos;ve confirmed
                  activity, group size, and pricing over email or WhatsApp.
                </p>
              </div>
            </Reveal>

            <Reveal className="faq-item">
              <button className="faq-q" onClick={handleFaqClick}>
                Can you arrange transport and gear?
                <span className="plus">+</span>
              </button>
              <div className="faq-a">
                <p>
                  93/A, Madiwala Rd, Embuldeniya, Nugegoda — a short drive from central
                  Colombo — walk-ins welcome during office hours.
                </p>
              </div>
            </Reveal>

            <Reveal className="faq-item">
              <button className="faq-q" onClick={handleFaqClick}>
                What happens if the weather turns on the day?
                <span className="plus">+</span>
              </button>
              <div className="faq-a">
                <p>
                  We reschedule rather than run a route our guides haven&apos;t
                  cleared. If we must cancel outright due to unforeseen
                  circumstances after costs are already committed, a refund may
                  not be possible — we&apos;ll always try to offer an alternative
                  experience where we can.
                </p>
              </div>
            </Reveal>

            <Reveal className="faq-item">
              <button className="faq-q" onClick={handleFaqClick}>
                What's your cancellation policy?
                <span className="plus">+</span>
              </button>
              <div className="faq-a">
                <p>
                  Cancel in writing to sales@extremeadventure.lk at least 7 days
                  before your event for a full refund. Cancellations within 7
                  days, or postponements, are treated as a rebooking.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
