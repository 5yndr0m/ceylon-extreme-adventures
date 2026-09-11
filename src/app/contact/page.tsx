import Image from 'next/image';
import Reveal from '../../components/Reveal';
import ContactForm from './ContactForm';
import ContactFaq from './ContactFaq';

export const metadata = {
  title: 'Contact Us',
  description: "Call, WhatsApp, or send an enquiry — tell us your dates, group size, and experience level, and we'll build the itinerary around you.",
};

export default function Contact() {
  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-bg">
          <Image
            src="https://cdn.sanity.io/images/b5qf24u0/production/b867d54473a4a617897ff4d68df2024e12dc048c-864x1080.jpg?w=2200&auto=format"
            alt="Hikers resting on the cliffs at Lakegala"
            fill
            priority
            sizes="100vw"
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
                  +94 707 900 700 / +94 707 900 701
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
                  sales@extremeadventure.lk
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
                  93/A, Madiwala Rd, Embuldeniya, Nugegoda
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
                  <span>Monday – Saturday</span>
                  <span>8:00 AM – 6:00 PM</span>
                </div>
                <div className="hours-row">
                  <span>Public Holidays</span>
                  <span>By arrangement</span>
                </div>
              </div>
            </Reveal>

            <ContactForm />
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
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d247.57332350198104!2d79.91240114905668!3d6.869842130954164!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bff217cb23b%3A0xe80bb79999171280!2sCeylon%20Extreme%20Adventure%20(Pvt)%20Ltd.!5e0!3m2!1sen!2sus!4v1788924598047!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Ceylon Extreme Adventures office location"
            ></iframe>
          </Reveal>
        </div>
      </section>

      <ContactFaq />
    </main>
  );
}
