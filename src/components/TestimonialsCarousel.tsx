'use client'

import {useEffect, useState} from 'react'
import Image from 'next/image'
import {urlFor} from '../lib/sanity'

// Long reviews (some run 5+ paragraphs) blow out the fixed-height testimonial
// card layout — truncate and link out to the full review instead of showing
// it all inline. Only truncates when there's a sourceUrl to send people to;
// otherwise showing a "..." with nowhere to go is worse than just showing
// the full (short) quote.
const QUOTE_TRUNCATE_LENGTH = 220
function truncateQuote(quote: string, sourceUrl?: string) {
  if (!sourceUrl || quote.length <= QUOTE_TRUNCATE_LENGTH) {
    return {text: quote, truncated: false}
  }
  const cut = quote.slice(0, QUOTE_TRUNCATE_LENGTH)
  const lastSpace = cut.lastIndexOf(' ')
  return {text: cut.slice(0, lastSpace > 0 ? lastSpace : QUOTE_TRUNCATE_LENGTH) + '…', truncated: true}
}

const AUTOPLAY_MS = 4500
// How far off-center (in card slots) a testimonial can sit before it's parked
// out of view — anything past this just fades out rather than staying laid out.
const MAX_VISIBLE_DISTANCE = 2

function TestimonialCard({t}: {t: any}) {
  const {text, truncated} = truncateQuote(t.quote, t.sourceUrl)
  return (
    <div className="testi-card">
      <div className="stars">{'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}</div>
      <p className="testi-quote">
        &quot;{text}&quot;
        {truncated && (
          <>
            {' '}
            <a href={t.sourceUrl} target="_blank" rel="noopener" className="testi-read-more">
              Read full review
            </a>
          </>
        )}
      </p>
      <div className="testi-author">
        <div className="avatar">
          {t.photo ? (
            <Image
              src={urlFor(t.photo).width(88).height(88).url()}
              alt={t.customerName}
              width={44}
              height={44}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--jungle-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="#fff" fillOpacity="0.85" />
                <path
                  d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
                  stroke="#fff"
                  strokeOpacity="0.85"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
        <div>
          <div className="author-name">{t.customerName}</div>
          <div className="author-tag">
            {t.experience ? `${t.experience.title}${t.experience.locationName ? ` — ${t.experience.locationName}` : ''}` : t.source}
          </div>
        </div>
      </div>
    </div>
  )
}

// Shortest signed distance from `index` to `i` around a circle of size `count`
// (e.g. going from the last testimonial to the first is a distance of +1, not
// -(count-1)) — this is what makes the wraparound feel continuous instead of
// the whole strip visibly snapping backwards once per loop.
function wrappedDiff(i: number, index: number, count: number) {
  let diff = i - index
  if (diff > count / 2) diff -= count
  if (diff < -count / 2) diff += count
  return diff
}

export default function TestimonialsCarousel({testimonials}: {testimonials: any[]}) {
  const count = testimonials.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (count <= 1 || paused) return
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [index, count, paused])

  if (count === 0) return null

  const goTo = (i: number) => setIndex(((i % count) + count) % count)

  return (
    <div
      className="testi-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="testi-carousel-row">
        {count > 1 && (
          <button
            type="button"
            className="testi-arrow testi-arrow-prev"
            onClick={() => goTo(index - 1)}
            aria-label="Previous testimonial"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        <div className="testi-stage">
          {testimonials.map((t, i) => {
            const diff = wrappedDiff(i, index, count)
            const distance = Math.abs(diff)
            if (distance > MAX_VISIBLE_DISTANCE) return null

            const opacity = distance <= 1 ? 1 : 0.35

            return (
              <div
                key={t._id}
                className={`testi-slot ${distance === 0 ? 'is-active' : ''}`}
                style={{
                  // Auto-play advances the index; negating diff here moves existing
                  // cards to the right (pulling the next one in from the left), so
                  // the carousel drifts left-to-right, matching the rest of the page.
                  '--diff': -diff,
                  '--slot-opacity': opacity,
                  zIndex: 10 - distance,
                  pointerEvents: distance === 0 ? 'auto' : 'none',
                } as React.CSSProperties}
              >
                <TestimonialCard t={t} />
              </div>
            )
          })}
        </div>

        {count > 1 && (
          <button
            type="button"
            className="testi-arrow testi-arrow-next"
            onClick={() => goTo(index + 1)}
            aria-label="Next testimonial"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="testi-dots">
          {testimonials.map((t, i) => (
            <button
              key={t._id}
              type="button"
              className={`testi-dot ${i === index ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
