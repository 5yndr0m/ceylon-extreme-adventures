import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy',
  description: 'Our cancellation, postponement, and refund terms for Ceylon Extreme Adventures bookings.',
};

export default function RefundPolicyPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-bg">
          <Image
            src="https://cdn.sanity.io/images/b5qf24u0/production/4f51e3d3e21ba3987b430cc641c987eccfc2db38-1920x1080.jpg?w=2200&auto=format"
            alt="Guide abseiling down a waterfall at Gartmore"
            fill
            priority
            sizes="100vw"
          />
          <div className="overlay"></div>
        </div>
        <div className="container page-hero-inner">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Refund Policy</span></div>
          <span className="eyebrow" style={{ color: 'var(--adrenaline-orange)' }}>Legal</span>
          <h1>Refund Policy</h1>
          <p className="page-hero-sub body-lg">
            How cancellations, postponements, and refunds work for bookings made with Ceylon Extreme Adventures.
          </p>
        </div>
      </section>

      <section className="terms-page">
        <div className="container terms-content">
          <div className="terms-block">
            <p>
              Thank you for booking with Ceylon Extreme Adventures. This policy explains when you&apos;re entitled to a refund
              if you need to cancel, and what happens if we have to cancel an event ourselves. It should be read alongside our{' '}
              <Link href="/terms">Terms &amp; Conditions</Link>.
            </p>
          </div>

          <div className="terms-block">
            <h3>Cancelling Your Booking</h3>
            <ul>
              <li>All cancellations must be made in writing to sales@extremeadventure.lk at least 7 days before the date of your event.</li>
              <li>A full refund is provided for cancellations made 7 or more days before the event date.</li>
              <li>Cancellations made less than 7 days before the event are not eligible for a refund.</li>
              <li>A postponement requested by you is treated the same as a cancellation and rebooking under this policy.</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>How Refunds Are Processed</h3>
            <ul>
              <li>Approved refunds are issued back to the original payment method used at checkout, processed securely through PayHere.</li>
              <li>We never see or store your card details — PayHere handles the transaction and the refund directly.</li>
              <li>Once we initiate a refund, please allow your bank or card provider&apos;s standard processing time for it to reflect in your account.</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>If We Cancel an Event</h3>
            <ul>
              <li><strong>Force Majeure:</strong> CEA reserves the right to cancel any ongoing event or program in the event of sudden unforeseen circumstances beyond our control — natural disasters, extreme weather, government actions, or anything that would jeopardize participant safety.</li>
              <li><strong>Refunds for Cancelled Events:</strong> If an event is cancelled for reasons beyond CEA&apos;s control and substantial expenses have already been incurred, we may not be able to provide a full refund. We regret any inconvenience this may cause.</li>
              <li><strong>Alternative Activities:</strong> Where possible, our team will offer alternative activities as a goodwill gesture, though this may not always be feasible.</li>
              <li><strong>Insurance:</strong> We strongly recommend all participants acquire travel and adventure sports insurance to cover unexpected cancellations.</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>Non-Refundable Items</h3>
            <ul>
              <li>Any add-ons, transport, or gear rental noted as non-refundable at the time of booking.</li>
              <li>Deposits or payments for bookings cancelled less than 7 days before the event, as set out above.</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>Contact Us</h3>
            <p>
              If you have any questions about this Refund Policy, or need to cancel or reschedule a booking, email us at{' '}
              <a href="mailto:sales@extremeadventure.lk">sales@extremeadventure.lk</a> or call +94 707 900 700 / +94 707 900 701.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
