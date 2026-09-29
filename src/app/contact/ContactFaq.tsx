'use client';

import Link from 'next/link';
import { useState } from 'react';
import Reveal from '../../components/Reveal';

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'How fast do you reply to enquiries?',
    a: 'Within one business day for email and form enquiries. Call or WhatsApp for anything same-day or urgent.',
  },
  {
    q: 'Do you need a deposit to confirm a booking?',
    a: "Yes, a deposit secures your date once we've confirmed activity, group size, and pricing over email or WhatsApp.",
  },
  {
    q: "What's your cancellation policy?",
    a: (
      <>
        Cancel in writing to sales@extremeadventure.lk at least 7 days before your event for a
        full refund. Cancellations within 7 days, or postponements, are treated as a rebooking.
        See our <Link href="/refund-policy">Refund Policy</Link> for full details.
      </>
    ),
  },
];

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="faq" id="faq">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Before you reach out</span>
          <h2>Quick Answers</h2>
        </Reveal>

        <div className="faq-list">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal className={`faq-item${open ? ' open' : ''}`} key={item.q}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  {item.q}
                  <span className="plus" aria-hidden="true">+</span>
                </button>
                <div
                  className="faq-a"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  inert={!open}
                >
                  <div className="faq-a-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
