// src/app/payment/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { client, urlFor } from '../../lib/sanity';
import { redirectToPayHere } from '../../lib/payhere';

type Booking = {
  _id: string;
  fullName: string;
  preferredDate: string;
  groupSize: number;
  experience: {
    title: string;
    category: string;
    price: number;
    heroImage: any;
  };
  event?: {
    title: string;
    price: number;
    flyerImage?: any;
  };
};

function PaymentHeader() {
  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--cloud-gray)' }}>
      <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--basalt-black)' }}>Ceylon Extreme Adventures</Link>
      <span className="bp-sub-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Secure checkout via PayHere
      </span>
    </div>
  );
}

function PaymentPortalInner() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    client
      .fetch(
        `*[_type == "booking" && _id == $id][0]{
          _id, fullName, preferredDate, groupSize,
          experience->{title, category, price, heroImage},
          event->{title, price, flyerImage}
        }`,
        { id: bookingId }
      )
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load your booking.');
        setLoading(false);
      });
  }, [bookingId]);

  async function proceedToPayment() {
    if (!bookingId) return;
    setRedirecting(true);
    const result = await redirectToPayHere(bookingId);
    if (result.error) {
      setError(result.error);
      setRedirecting(false);
    }
    // On success, redirectToPayHere() has already submitted the form and the
    // browser is navigating away — nothing more to do here
  }

  if (!bookingId) {
    return (
      <main className="bp-page">
        <PaymentHeader />
        <div className="container bp-top" style={{ textAlign: 'center', paddingBottom: 90 }}>
          <h1 className="bp-title" style={{ margin: '0 auto 14px' }}>No booking selected</h1>
          <p className="bp-prose" style={{ margin: '0 auto 28px' }}>
            Please start from an event or experience page to make a booking.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/#events" className="btn btn-primary">Browse Upcoming Events</Link>
            <Link href="/experiences" className="btn btn-dark">Browse Experiences</Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="bp-page">
        <PaymentHeader />
        <div className="container bp-top" style={{ textAlign: 'center', paddingBottom: 90 }}>
          <p className="bp-prose">Loading your booking…</p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="bp-page">
        <PaymentHeader />
        <div className="container bp-top" style={{ textAlign: 'center', paddingBottom: 90 }}>
          <p className="bp-form-error">{error || 'Booking not found.'}</p>
        </div>
      </main>
    );
  }

  // Event bookings use the event's own price/title (can differ from the experience's
  // base rate — promos, group rates, etc., see eventType.ts) — same priority the
  // PayHere checkout route already uses server-side.
  const item = booking.event ?? booking.experience;
  const displayImage = booking.event?.flyerImage ?? booking.experience.heroImage;
  const total = item.price * booking.groupSize;

  return (
    <main className="bp-page">
      <PaymentHeader />

      <div className="container bp-top" style={{ paddingTop: 32 }}>
        <div className="bp-breadcrumb">
          <Link href="/">Home</Link> / <Link href="/experiences">Experiences</Link> / <span>Payment</span>
        </div>
        <h1 className="bp-title">Review &amp; Pay</h1>
        <div className="bp-subline">
          <span className="bp-tag">{booking.experience.category}</span>
          <span className="bp-sub-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {booking.preferredDate}
          </span>
          <span className="bp-sub-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {booking.groupSize} {booking.groupSize === 1 ? 'slot' : 'slots'}
          </span>
        </div>
      </div>

      <div className="container bp-grid">
        <div className="bp-main">
          <section className="bp-section">
            <h2>Trip summary</h2>
            <div className="bp-event-top" style={{ marginBottom: 0 }}>
              {displayImage && (
                <div className="bp-flyer" style={{ maxWidth: 280, aspectRatio: '4/3' }}>
                  <img
                    src={urlFor(displayImage).width(700).height(525).url()}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="bp-event-top-details" style={{ paddingTop: 4 }}>
                <h3 style={{ fontSize: 19, color: 'var(--basalt-black)', marginBottom: 4 }}>{item.title}</h3>
                <p className="bp-book-note" style={{ textAlign: 'left', margin: '0 0 18px' }}>
                  Reference: {booking._id.slice(-8).toUpperCase()}
                </p>

                <div className="bp-facts-row" style={{ marginBottom: 0 }}>
                  <div className="bp-fact-pill">
                    <span className="bp-fact-pill-label">Date</span>
                    <span className="bp-fact-pill-value">{booking.preferredDate}</span>
                  </div>
                  <div className="bp-fact-pill">
                    <span className="bp-fact-pill-label">Slots</span>
                    <span className="bp-fact-pill-value">{booking.groupSize}</span>
                  </div>
                  <div className="bp-fact-pill">
                    <span className="bp-fact-pill-label">Rate</span>
                    <span className="bp-fact-pill-value">LKR {item.price.toLocaleString()} pp</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bp-section">
            <h2>Price breakdown</h2>
            <dl className="bp-quickfacts">
              <div className="bp-quickfacts-row">
                <dt>Package ({booking.groupSize} × LKR {item.price.toLocaleString()})</dt>
                <dd>LKR {total.toLocaleString()}</dd>
              </div>
              <div className="bp-quickfacts-row">
                <dt style={{ fontWeight: 700, color: 'var(--basalt-black)' }}>Total due</dt>
                <dd style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--jungle-green)' }}>
                  LKR {total.toLocaleString()}
                </dd>
              </div>
            </dl>
            <div className="bp-prose">
              <p>
                Cancel 7+ days before your event for a full refund. Guide-verified safety checks run on
                every departure — see our <Link href="/contact">cancellation policy</Link> for details.
              </p>
            </div>
          </section>
        </div>

        <aside className="bp-book-col">
          <div className="bp-book-card">
            <div className="bp-book-price">
              <span className="bp-book-amount">LKR {total.toLocaleString()}</span>
              <span className="bp-book-unit">total due</span>
            </div>
            <p className="bp-book-note" style={{ marginTop: 0, marginBottom: 20 }}>
              Payment is processed securely by PayHere — we never see or store your card details.
            </p>

            <button
              type="button"
              className="btn btn-primary bp-submit"
              onClick={proceedToPayment}
              disabled={redirecting}
            >
              {redirecting ? 'Redirecting…' : `Proceed to Pay LKR ${total.toLocaleString()}`}
            </button>
            {error && <p className="bp-form-error" style={{ marginTop: 10, textAlign: 'center' }}>{error}</p>}

            <p className="bp-book-note">Accepts Visa, Mastercard, and Amex — LKR and international cards.</p>

            <ul className="bp-included-list" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--cloud-gray)' }}>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secure checkout via PayHere
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4z"/></svg>
                PCI-DSS compliant, we never see your card
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                Full refund 7+ days before departure
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Support: +94 707 900 700
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="container" style={{ padding: '24px 0 48px', borderTop: '1px solid var(--cloud-gray)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14, fontSize: 13, color: 'var(--stone-gray)' }}>
        <span>© 2026 Ceylon Extreme Adventures (Pvt) Ltd.</span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href="/contact">Refund Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <a href="mailto:sales@extremeadventure.lk">sales@extremeadventure.lk</a>
        </div>
      </div>
    </main>
  );
}

// useSearchParams requires a Suspense boundary in the App Router
export default function PaymentPortal() {
  return (
    <Suspense fallback={<main className="bp-page" />}>
      <PaymentPortalInner />
    </Suspense>
  );
}
