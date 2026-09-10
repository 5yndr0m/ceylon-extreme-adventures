'use client';

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
            <Link href={`/about/team/${founder.slug.current}`} className="founder-card-link" aria-label={`View ${founder.name}'s profile`}>
              {founder.portraitImage ? (
                <img src={urlFor(founder.portraitImage).width(600).height(760).url()} alt={founder.name} className="founder-img" />
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
        <Link href={`/about/team/${activeFounder.slug.current}`} className="founder-profile-link">View full profile <span aria-hidden="true">→</span></Link>
      </div>

      <style jsx>{`
        .founders-slider {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          width: 100%;
        }
        .founders-track {
          position: relative;
          width: 100%;
          max-width: 560px;
          height: 380px;
        }
        .founder-card {
          position: absolute;
          top: 0;
          width: 30%;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--cloud-gray);
          box-shadow: 0 16px 34px -22px rgba(20, 24, 26, 0.35);
          transition:
            left 0.8s cubic-bezier(0.65, 0, 0.35, 1),
            top 0.8s cubic-bezier(0.65, 0, 0.35, 1),
            height 0.8s cubic-bezier(0.65, 0, 0.35, 1),
            width 0.8s cubic-bezier(0.65, 0, 0.35, 1),
            box-shadow 0.4s ease;
        }

        /* left slot */
        .slot-0 {
          left: 0%;
          height: 300px;
          top: 40px;
          z-index: 1;
        }
        /* middle slot (tall) */
        .slot-1 {
          left: 35%;
          height: 380px;
          top: 0;
          z-index: 2;
          box-shadow: 0 22px 44px -20px rgba(242, 98, 46, 0.45);
        }
        /* right slot */
        .slot-2 {
          left: 70%;
          height: 300px;
          top: 40px;
          z-index: 1;
        }

        /* forced behind everything else for the whole duration of the
           right -> left wrap-around move, regardless of DOM order */
        .founder-card.is-wrapping {
          z-index: 0 !important;
        }

        .founder-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .founder-card-link {
          display: block;
          width: 100%;
          height: 100%;
        }
        .founder-img-fallback {
          background: var(--jungle-green);
        }
        .founder-overlay {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 16px 14px;
          background: linear-gradient(180deg, transparent 0%, rgba(10, 12, 11, 0.88) 100%);
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }
        .founder-name {
          color: #fff;
          font-weight: 700;
          font-size: 15px;
        }
        .founder-role {
          color: var(--adrenaline-orange);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .founder-desc {
          max-width: 100%;
          text-align: center;
          border-top: 1px solid var(--cloud-gray);
          padding-top: 18px;
        }
        .founder-desc-name {
          display: block;
          font-family: var(--font-display);
          font-size: 22px;
          color: var(--jungle-green);
          text-transform: uppercase;
        }
        .founder-desc-role {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--adrenaline-orange);
        }
        .founder-desc-bio {
          margin-top: 14px;
          color: var(--stone-gray);
          font-size: 15px;
          line-height: 1.6;
        }
        .founder-profile-link {
          display: inline-flex;
          gap: 8px;
          margin-top: 14px;
          color: var(--jungle-green);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .4px;
          text-transform: uppercase;
        }

        @media (max-width: 640px) {
          .founders-track {
            height: 260px;
          }
          .slot-1 {
            height: 260px;
          }
          .slot-0,
          .slot-2 {
            height: 200px;
            top: 30px;
          }
        }
      `}</style>
    </div>
  );
}