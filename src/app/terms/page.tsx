import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | Ceylon Extreme Adventures',
  description: 'Booking, cancellation, and participant terms for Ceylon Extreme Adventures.',
};

export default function TermsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1629248564797-8c5ba85da9d3?fm=jpg&q=70&w=2200&auto=format&fit=crop"
            alt="Ceylon Extreme Adventures guides on a river"
          />
          <div className="overlay"></div>
        </div>
        <div className="container page-hero-inner">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Terms &amp; Conditions</span></div>
          <span className="eyebrow" style={{ color: 'var(--adrenaline-orange)' }}>Legal</span>
          <h1>Terms &amp; Conditions</h1>
          <p className="page-hero-sub body-lg">
            Please read these terms before booking any Ceylon Extreme Adventures experience.
          </p>
        </div>
      </section>

      <section className="terms-page">
        <div className="container terms-content">
          <div className="terms-block">
            <h3>Company Information</h3>
            <ul>
              <li><strong>Company:</strong> Ceylon Extreme Adventures</li>
              <li><strong>Tagline:</strong> In search of freedom</li>
              <li><strong>Address:</strong> 93/A, Madiwala Rd, Embuldeniya, Nugegoda</li>
              <li><strong>Website:</strong> www.extremeadventure.lk</li>
              <li><strong>Email:</strong> sales@extremeadventure.lk</li>
              <li><strong>Contact Numbers:</strong> +94 707 900 700 / +94 707 900 701</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>Client Cancellation Policy</h3>
            <ul>
              <li>All client cancellations must be made in writing at least 7 days prior to the date of the event and sent to sales@extremeadventure.lk.</li>
              <li>A full refund will be offered for client cancellations made prior to 7 days before the date of the event.</li>
              <li>A postponement from the client&apos;s end will be treated as a cancellation and re-booking.</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>Event Cancellation Due to Unforeseen Circumstances</h3>
            <ul>
              <li><strong>Force Majeure:</strong> CEA reserves the right to cancel any ongoing event or program in the event of sudden unforeseen circumstances beyond our control — natural disasters, extreme weather, government actions, or anything that would jeopardize participant safety.</li>
              <li><strong>Refund Policy:</strong> If an event is cancelled for reasons beyond CEA&apos;s control and substantial expenses have already been incurred, CEA will not be able to provide refunds. We regret any inconvenience this may cause.</li>
              <li><strong>Alternative Activities:</strong> Where possible, our team will offer alternative activities as a goodwill gesture, though this may not always be feasible.</li>
              <li><strong>Insurance:</strong> We strongly recommend participants acquire travel and adventure sports insurance to cover unexpected cancellations.</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>Reservations</h3>
            <ul>
              <li>Tentative reservations are only made upon receipt of the advance payment and Reservation Forms, and following our confirmation.</li>
              <li>No amendments are allowed within 24 hours of the event date (e.g. change of participants, with/without transport).</li>
              <li>All participants must complete the Reservation Form.</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>Participant Responsibilities, Liability &amp; Program Guidelines</h3>
            <ul>
              <li>CEA reserves the right to cancel or remove individuals from any event due to inappropriate behavior, suspicion of alcohol or drug use, lack of suitable clothing/equipment, or incomplete medical consent.</li>
              <li>All clients must follow CEA recommendations.</li>
              <li>All clients must obtain their own insurance to cover any accident or injury.</li>
              <li>CEA will only accept liability for injury to a client where negligence on our part is proven.</li>
              <li>Losses or damage to CEA equipment caused by an individual or group will be invoiced to that person, group, or booking organization.</li>
              <li>Anyone using their own equipment should ensure it is adequately insured and appropriate for the event.</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>Complaints</h3>
            <ul>
              <li>Complaints should first be discussed directly with the CEA Chief Instructor during or after the event so corrective measures can be taken.</li>
              <li>If not raised at the time, complaints made afterward must be submitted in writing within 28 days.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}