'use client';

import Reveal from '../../components/Reveal';

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

export default function ContactFaq() {
  return (
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
              What&apos;s your cancellation policy?
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
  );
}
