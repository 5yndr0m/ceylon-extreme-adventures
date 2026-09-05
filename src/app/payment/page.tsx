// src/app/payment/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Reveal from '../../components/Reveal';
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
};

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
          experience->{title, category, price, heroImage}
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
      <main className="payment-page">
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>No booking selected. Please start from an event or experience page.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <Link href="/#events" className="btn btn-primary">
              Browse Upcoming Events
            </Link>
            <Link href="/experiences" className="btn btn-ghost" style={{ color: 'var(--jungle-green)', borderColor: 'var(--jungle-green)' }}>
              Browse Experiences
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="payment-page">
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>Loading your booking…</p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="payment-page">
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>{error || 'Booking not found.'}</p>
        </div>
      </main>
    );
  }

  const total = booking.experience.price * booking.groupSize;

  return (
    <main className="payment-page">
      <div className="secure-header">
        <div className="container secure-header-inner">
          <Link href="/" className="logo">Ceylon<span>X</span>treme</Link>
          <span className="secure-pill">🔒 Secure Checkout via PayHere</span>
        </div>
      </div>

      <section className="payment-hero">
        <div className="container page-hero-inner">
          <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/experiences">Experiences</Link> / <span>Payment</span></div>
          <span className="eyebrow">Almost there</span>
          <h1>Review &amp; Pay</h1>
          <p className="page-hero-sub body-lg">
            Confirm your booking details below, then you'll be securely redirected to PayHere to complete payment.
          </p>
          <div className="steps">
            <div className="step done"><span className="step-num">✓</span> Trip Details</div>
            <i />
            <div className="step active"><span className="step-num">2</span> Payment</div>
            <i />
            <div className="step"><span className="step-num">3</span> Confirmation</div>
          </div>
        </div>
      </section>

      <section className="payment-portal">
        <div className="container pay-grid">
          <Reveal className="summary-card">
            <div className="summary-img">
              {booking.experience.heroImage && (
                <img
                  src={urlFor(booking.experience.heroImage).width(900).height(506).url()}
                  alt={booking.experience.title}
                />
              )}
              <span className="summary-ref">REF: {booking._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="summary-body">
              <span className="summary-tag">{booking.experience.category}</span>
              <h3>{booking.experience.title}</h3>
              <div className="summary-meta">
                <span>📅 {booking.preferredDate}</span>
                <span>👥 {booking.groupSize} {booking.groupSize === 1 ? 'traveller' : 'travellers'}</span>
              </div>
              <div className="price-lines">
                <div>
                  <span>Package ({booking.groupSize} × LKR {booking.experience.price.toLocaleString()})</span>
                  <span>{total.toLocaleString()} LKR</span>
                </div>
              </div>
              <div className="price-total">
                <strong>Total due</strong>
                <strong>{total.toLocaleString()} <small>LKR</small></strong>
              </div>
              <p className="guarantee-note">
                🛡 Cancel 7+ days before your event for a full refund. Guide-verified safety checks on every departure. See our cancellation policy for details.
              </p>
            </div>
          </Reveal>

          <Reveal className="pay-panel">
            <div className="form-section-label">Ready to confirm</div>
            <p style={{ color: 'var(--stone-gray)', fontSize: 14, marginBottom: 24 }}>
              Payment is processed securely by PayHere — we never see or store your card details.
              You'll be redirected to complete payment, then brought back here automatically.
            </p>
            <button
              type="button"
              className="btn btn-primary pay-cta"
              onClick={proceedToPayment}
              disabled={redirecting}
            >
              {redirecting ? 'Redirecting…' : `🔒 Proceed to Pay ${total.toLocaleString()} LKR`}
            </button>
            {error && <p style={{ color: 'crimson', fontSize: 13, marginTop: 10 }}>{error}</p>}
            <div className="lock-note">✓ Accepts Visa, Mastercard, Amex — LKR and international cards.</div>
          </Reveal>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-grid">
          {[
            ['🔒', 'Secure Checkout', 'Handled entirely by PayHere'],
            ['🛡', 'PCI-DSS Compliant', 'We never see your card details'],
            ['✓', 'Fair Cancellation Policy', 'Full refund if you cancel 7+ days ahead'],            ['☎', '24/7 Support', '+94 707 900 700'],
          ].map(([icon, title, text]) => (
            <div className="trust-item" key={title}>
              <div className="trust-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="payment-footer">
        <div className="container footer-row">
          <span>© 2026 Ceylon Extreme Adventures (Pvt) Ltd.</span>
          <div className="footer-links">
            <Link href="/contact">Refund Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <a href="mailto:sales@extremeadventure.lk">sales@extremeadventure.lk</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .secure-header{background:rgba(20,24,26,.96);padding:16px 0;box-shadow:0 2px 20px rgba(0,0,0,.15)}.secure-header-inner{display:flex;align-items:center;justify-content:space-between}.secure-pill{color:rgba(255,255,255,.85);font-size:12px;font-weight:600}.payment-hero{background:var(--jungle-green-dark);padding:70px 0 52px}.payment-hero h1{color:#fff}.payment-hero .eyebrow{display:block;margin-bottom:10px}.steps{display:flex;align-items:center;gap:8px;margin-top:28px;flex-wrap:wrap}.step{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;text-transform:uppercase;color:rgba(255,255,255,.45)}.step-num{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.12)}.step.done{color:rgba(255,255,255,.85)}.step.done .step-num{background:var(--success-green);color:#fff}.step.active{color:#fff}.step.active .step-num{background:var(--adrenaline-orange);color:#fff}.steps i{width:20px;height:1px;background:rgba(255,255,255,.25)}.pay-grid{display:grid;gap:28px;align-items:start}@media(min-width:960px){.pay-grid{grid-template-columns:1fr 1.35fr;gap:36px}.summary-card{position:sticky;top:96px}}.summary-card,.pay-panel{background:#fff;border:1px solid var(--cloud-gray);border-radius:var(--radius-md);overflow:hidden;box-shadow:0 18px 44px -28px rgba(20,24,26,.3)}.summary-img{position:relative;aspect-ratio:16/9;overflow:hidden}.summary-img img{width:100%;height:100%;object-fit:cover}.summary-ref{position:absolute;top:12px;left:12px;background:rgba(20,24,26,.85);color:#fff;font-size:11px;font-weight:700;padding:6px 12px;border-radius:var(--radius-pill)}.summary-body{padding:24px}.summary-tag{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--adrenaline-orange)}.summary-meta{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;color:var(--stone-gray);font-size:13px}.price-lines{margin-top:22px;padding-top:18px;border-top:1px dashed var(--cloud-gray);display:grid;gap:10px}.price-lines div,.price-total{display:flex;justify-content:space-between;font-size:14px;color:var(--stone-gray)}.price-total{align-items:baseline;margin-top:8px;padding-top:14px;border-top:2px solid var(--jungle-green);color:var(--basalt-black)}.price-total strong:last-child{font-family:var(--font-display);font-size:26px;color:var(--jungle-green)}.price-total small{font-family:var(--font-body);font-size:13px;color:var(--stone-gray)}.guarantee-note{margin-top:20px;padding:14px;background:var(--mist-white);border-radius:var(--radius-sm);font-size:12.5px;color:var(--stone-gray);line-height:1.5}.pay-panel{padding:28px}@media(min-width:768px){.pay-panel{padding:36px}}.form-section-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--jungle-green);margin:6px 0 -4px;border-bottom:1px solid var(--cloud-gray);padding-bottom:4px}.pay-cta{width:100%;margin-top:20px;padding:17px 24px;font-size:15px}.lock-note{text-align:center;font-size:12px;color:var(--stone-gray);margin-top:14px}.trust-strip{background:var(--mist-white);border-top:1px solid var(--cloud-gray)}.trust-grid{display:grid;gap:22px;grid-template-columns:repeat(2,1fr)}@media(min-width:768px){.trust-grid{grid-template-columns:repeat(4,1fr)}}.trust-item{text-align:center}.trust-icon{margin:0 auto 10px;width:48px;height:48px;border-radius:50%;background:#fff;border:1.5px solid var(--cloud-gray);display:flex;align-items:center;justify-content:center;color:var(--jungle-green)}.trust-item h3{font-size:14px}.trust-item p{font-size:12.5px;color:var(--stone-gray)}.payment-footer{background:var(--basalt-black);color:rgba(255,255,255,.6);padding:32px 0}.footer-row{display:flex;flex-wrap:wrap;justify-content:space-between;gap:14px;font-size:13px}.footer-links{display:flex;gap:18px;flex-wrap:wrap}
      `}</style>
    </main>
  );
}

// useSearchParams requires a Suspense boundary in the App Router
export default function PaymentPortal() {
  return (
    <Suspense fallback={<main className="payment-page" />}>
      <PaymentPortalInner />
    </Suspense>
  );
}
