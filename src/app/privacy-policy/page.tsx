import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Ceylon Extreme Adventures collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
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
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Privacy Policy</span></div>
          <span className="eyebrow" style={{ color: 'var(--adrenaline-orange)' }}>Legal</span>
          <h1>Privacy Policy</h1>
          <p className="page-hero-sub body-lg">
            We collect the minimum we need to run your booking, and nothing more. Here&apos;s exactly what that is.
          </p>
        </div>
      </section>

      <section className="terms-page">
        <div className="container terms-content">
          <div className="terms-block">
            <p>
              Ceylon Extreme Adventures (&quot;CEA&quot;, &quot;we&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy
              explains what information we collect when you use extremeadventure.lk or book an experience with us, how we use it,
              and who we share it with. By using our website or making a booking, you agree to the practices described here.
            </p>
          </div>

          <div className="terms-block">
            <h3>Information We Collect</h3>
            <ul>
              <li><strong>Booking details:</strong> your full name, email address, phone number, preferred date, group size, and any message you add, submitted when you make a booking or enquiry.</li>
              <li><strong>Payment information:</strong> collected and processed directly by PayHere, our third-party payment provider. We never receive or store your card details — only the payment status and a transaction reference are passed back to us.</li>
              <li><strong>Contact form messages:</strong> our contact form opens a message in your own email client addressed to sales@extremeadventure.lk — we don&apos;t receive or store anything from that form until you actually send the email.</li>
              <li><strong>Basic site analytics:</strong> we use Vercel Analytics to understand aggregate traffic to our site. It does not use cookies and does not track you individually across websites.</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>How We Use Your Information</h3>
            <ul>
              <li>To process, confirm, and manage your booking.</li>
              <li>To send you booking and payment confirmation emails, via our email provider, Resend.</li>
              <li>To respond to enquiries or messages you send us directly.</li>
              <li>To understand, in aggregate, how visitors use our website so we can improve it.</li>
              <li>To detect and prevent fraud or misuse of our booking system.</li>
            </ul>
          </div>

          <div className="terms-block">
            <h3>Who We Share Information With</h3>
            <p>
              We do not sell, trade, or rent your personal information to anyone. We share it only with the trusted service
              providers who help us run our booking and payment process, and only to the extent needed for that purpose:
            </p>
            <ul>
              <li><strong>PayHere</strong> — to process your payment securely.</li>
              <li><strong>Sanity</strong> — our content and booking management system, where your booking record is stored.</li>
              <li><strong>Resend</strong> — to deliver booking and payment confirmation emails.</li>
              <li><strong>Vercel</strong> — our website hosting provider.</li>
            </ul>
            <p>We may also disclose your information if required to do so by law or a valid legal request.</p>
          </div>

          <div className="terms-block">
            <h3>Data Security</h3>
            <p>
              We use reasonable technical measures to protect your personal information from unauthorized access, disclosure,
              or misuse. That said, no method of transmission over the internet is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </div>

          <div className="terms-block">
            <h3>Cookies</h3>
            <p>
              We do not use tracking or advertising cookies on this website. The analytics tool we use, Vercel Analytics,
              is cookieless by design.
            </p>
          </div>

          <div className="terms-block">
            <h3>Your Rights</h3>
            <p>
              You can ask us to access, correct, or delete the personal information we hold about you at any time by
              emailing sales@extremeadventure.lk.
            </p>
          </div>

          <div className="terms-block">
            <h3>Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page.
            </p>
          </div>

          <div className="terms-block">
            <h3>Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy or how we handle your information, email us at{' '}
              <a href="mailto:sales@extremeadventure.lk">sales@extremeadventure.lk</a> or call +94 707 900 700 / +94 707 900 701.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
