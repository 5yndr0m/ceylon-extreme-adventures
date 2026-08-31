'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const headerClass = isHome ? (scrolled ? 'scrolled transparent-mode' : 'transparent-mode') : (scrolled ? 'scrolled' : '');

  return (
    <>
      <header id='siteHeader' className={headerClass}>
        <div className='container nav-row'>
          <Link href='/' className='logo'>Ceylon<span>X</span>treme</Link>
          <nav className='nav-links'>
            <Link href='/experiences' className={pathname === '/experiences' ? 'active' : ''}>Experiences</Link>
            <Link href='/about' className={pathname === '/about' ? 'active' : ''}>About Us</Link>
            <Link href='/blog' className={pathname?.startsWith('/blog') ? 'active' : ''}>Blog</Link>
            <Link href={isHome ? '#gallery' : '/#gallery'}>Gallery</Link>
            <Link href='/contact' className={pathname === '/contact' ? 'active' : ''}>Contact</Link>
          </nav>
          <Link href='/payment' className='btn btn-primary nav-cta'>Book Now</Link>
          <button 
            className={`hamburger ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label='Open menu'
            aria-expanded={isOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${isOpen ? 'open' : ''}`} id='mobileMenu'>
        <Link href='/experiences' onClick={() => setIsOpen(false)}>Experiences</Link>
        <Link href='/about' onClick={() => setIsOpen(false)}>About Us</Link>
        <Link href='/blog' onClick={() => setIsOpen(false)}>Blog</Link>
        <Link href={isHome ? '#gallery' : '/#gallery'} onClick={() => setIsOpen(false)}>Gallery</Link>
        <Link href='/contact' onClick={() => setIsOpen(false)}>Contact</Link>
        <Link href='/payment' className='btn btn-primary' style={{ marginTop: '10px' }} onClick={() => setIsOpen(false)}>Book Now</Link>
      </div>
    </>
  );
}
