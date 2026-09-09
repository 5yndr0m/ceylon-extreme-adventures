'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { urlFor } from '../lib/sanity'

type Testimonial = {
  _id: string
  customerName: string
  quote: string
  rating?: number
  source?: string
  sourceUrl?: string
  photo?: Record<string, unknown>
  experience?: {title: string; locationName?: string}
}

const AUTOPLAY_MS = 5000
const QUOTE_TRUNCATE_LENGTH = 220

function truncateQuote(quote: string, sourceUrl?: string) {
  if (!sourceUrl || quote.length <= QUOTE_TRUNCATE_LENGTH) {
    return {text: quote, truncated: false}
  }
  const cut = quote.slice(0, QUOTE_TRUNCATE_LENGTH)
  const lastSpace = cut.lastIndexOf(' ')
  return {text: cut.slice(0, lastSpace > 0 ? lastSpace : QUOTE_TRUNCATE_LENGTH) + '…', truncated: true}
}

function TestimonialCard({testimonial}: {testimonial: Testimonial}) {
  const {text, truncated} = truncateQuote(testimonial.quote, testimonial.sourceUrl)
  const rating = testimonial.rating || 5

  return (
    <article className="testi-card">
      <div className="stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>
      <p className="testi-quote">
        &quot;{text}&quot;
        {truncated && (
          <>
            {' '}
            <a href={testimonial.sourceUrl} target="_blank" rel="noopener" className="testi-read-more">
              Read full review
            </a>
          </>
        )}
      </p>
      <div className="testi-author">
        <div className="avatar">
          {testimonial.photo ? (
            <Image
              src={urlFor(testimonial.photo).width(88).height(88).url()}
              alt={testimonial.customerName}
              width={44}
              height={44}
            />
          ) : (
            <div className="avatar-fallback" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="#fff" fillOpacity="0.85" />
                <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#fff" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <div className="author-name">{testimonial.customerName}</div>
          <div className="author-tag">
            {testimonial.experience
              ? `${testimonial.experience.title}${testimonial.experience.locationName ? ` — ${testimonial.experience.locationName}` : ''}`
              : testimonial.source}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function TestimonialsCarousel({testimonials}: {testimonials: Testimonial[]}) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (testimonials.length < 2) return
    const interval = setInterval(() => {
      setActiveIndex((index) => (index + 1) % testimonials.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(interval)
  }, [testimonials.length])

  if (testimonials.length === 0) {
    return <p style={{color: 'var(--stone-gray)'}}>Reviews coming soon.</p>
  }

  const goTo = (index: number) => {
    setActiveIndex((index + testimonials.length) % testimonials.length)
  }
  const getTestimonial = (offset: number) => testimonials[(activeIndex + offset + testimonials.length) % testimonials.length]

  return (
    <div className="testi-carousel" aria-label="Customer testimonials">
      <button className="testi-nav prev" onClick={() => goTo(activeIndex - 1)} aria-label="Previous testimonial">‹</button>
      <div className="testi-track">
        {[-1, 0, 1].map((offset) => {
          const testimonial = getTestimonial(offset)
          return (
            <div
              className={`testi-slide testi-slot-${offset + 1} ${offset === 0 ? 'is-active' : ''}`}
              key={testimonials.length > 2 ? testimonial._id : `${testimonial._id}-${offset}`}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          )
        })}
      </div>
      <button className="testi-nav next" onClick={() => goTo(activeIndex + 1)} aria-label="Next testimonial">›</button>
      <div className="testi-dots">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial._id}
            className={index === activeIndex ? 'active' : ''}
            onClick={() => goTo(index)}
            aria-label={`Go to testimonial from ${testimonial.customerName}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  )
}
