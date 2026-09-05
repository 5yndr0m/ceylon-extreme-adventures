import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <footer>
        <div className='container'>
          <div className='footer-grid'>
            <div className='footer-col'>
              <div className='footer-logo'>Ceylon<span>X</span>treme</div>
              <p style={{ fontSize: '14px', maxWidth: '32ch' }}>In search of freedom</p>
              <div className='social-row'>
                <a href='https://www.facebook.com/extremeadventure.lk' target='_blank' rel='noopener' aria-label='Facebook'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='#fff'><path d='M13.5 21v-7.5H16l.5-3H13.5V8.3c0-.87.24-1.46 1.5-1.46H16.5V4.2C16.2 4.16 15.2 4 14 4c-2.4 0-4 1.47-4 4.16v2.34H7.5v3H10V21h3.5z'/></svg>
                </a>
                <a href='https://www.instagram.com/extremeadventures.lk/' target='_blank' rel='noopener' aria-label='Instagram'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='1.8'><rect x='3' y='3' width='18' height='18' rx='5'/><circle cx='12' cy='12' r='4'/><circle cx='17.2' cy='6.8' r='1'/></svg>
                </a>
                <a href='https://www.youtube.com/@ceylonextremeadventures3799' target='_blank' rel='noopener' aria-label='YouTube'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='#fff'><path d='M22 12s0-3.2-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.5c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.5c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.7.4-4.7zM10 15.3V8.7l6 3.3-6 3.3z'/></svg>
                </a>
              </div>
            </div>
            <div className='footer-col'>
              <h4>Experiences</h4>
              <Link href='/experiences?category=Abseiling'>Waterfall Abseiling</Link>
              <Link href='/experiences?category=Canyoning'>Canyoning</Link>
              <Link href='/experiences?category=Rafting'>White-Water Rafting</Link>
              <Link href='/experiences?category=Hiking'>Hiking &amp; Trekking</Link>
            </div>
            <div className='footer-col'>
              <h4>Support</h4>
              <Link href='/contact#faq'>FAQ</Link>
              <Link href='/blog'>Trip Planning Guides</Link>
              {/* No standalone Safety Policy / Terms pages exist yet — routing to Contact
                  rather than leaving a dead href="#" until those pages are written */}
              <Link href='/contact'>Safety Policy</Link>
              <Link href='/terms'>Terms &amp; Conditions</Link>
            </div>
            <div className='footer-col'>
              <h4>Contact</h4>
              <Link href='/contact#location'>93/A, Madiwala Rd, Embuldeniya, Nugegoda</Link>
              <a href='mailto:sales@extremeadventure.lk'>sales@extremeadventure.lk</a>
              <a href='tel:+94707900700'>+94 707 900 700</a>
              <a href='tel:+94707900701'>+94 707 900 701</a>
            </div>
          </div>
          <div className='footer-bottom'>
            <span>© 2026 Ceylon Extreme Adventures. All rights reserved.</span>
            <span>www.extremeadventure.lk</span>
          </div>
        </div>
      </footer>
      <div className='sticky-cta'><Link href='/#events' className='btn btn-primary'>Book Now</Link></div>
    </>
  );
}