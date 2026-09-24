'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Founder = {
  _id: string;
  name: string;
  role?: string;
  portraitImage?: any;
  slug: { current: string };
  bio?: string;
};
import { urlFor } from '../lib/sanity';

const TRANSITION_MS = 800;

// slotOf[i] = current slot (0 = left, 1 = middle, 2 = right) of founders[i]
export default function FoundersSlider({ founders }: { founders: Founder[] }) {
  const visibleFounders = founders.slice(0, 3);
  const [slotOf, setSlotOf] = useState<number[]>([0, 1, 2]);
  const [wrapping, setWrapping] = useState<Set<number>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlotOf((prev) => {
        // whichever founder is currently at the far-right slot (2) is about
        // to wrap around to the left slot (0) — that's the one that needs
        // to duck behind everything else for the duration of the move
        const wrappingNow = new Set(
          prev.reduce<number[]>((acc, s, i) => (s === 2 ? [...acc, i] : acc), [])
        );
        setWrapping(wrappingNow);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setWrapping(new Set());
        }, TRANSITION_MS + 50);

        return prev.map((s) => (s + 1) % 3);
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (visibleFounders.length === 0) return null;

  const activeFounder = visibleFounders[slotOf.indexOf(1) % visibleFounders.length];

  return (
    <div className="founders-slider">
      <div className="founders-track">
        {visibleFounders.map((founder, i) => (
          <div
            key={founder._id}
            className={`founder-card slot-${slotOf[i]} ${wrapping.has(i) ? 'is-wrapping' : ''}`}
          >
            <Link href={`/about/team/${founder.slug.current}`} className="founder-card-link">
              {founder.portraitImage ? (
                <Image
                  src={urlFor(founder.portraitImage).width(600).height(760).url()}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 300px, 55vw"
                  quality={90}
                  className="founder-img"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="founder-img founder-img-fallback" />
              )}
              <div className="founder-overlay">
                <span className="founder-name">{founder.name}</span>
                <span className="founder-role">{founder.role}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="founder-desc">
        <span className="founder-desc-name">{activeFounder.name}</span>
        <span className="founder-desc-role">{activeFounder.role}</span>
        <p className="founder-desc-bio">{activeFounder.bio}</p>
        <Link href={`/about/team/${activeFounder.slug.current}`} className="founder-profile-link">View full profile</Link>
      </div>

    </div>
  );
}