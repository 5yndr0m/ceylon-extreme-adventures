'use client'

import { useEffect, useRef, useState } from 'react'

type Activity = {
  href: string
  image: string
  alt: string
  title: string
  description: string
}

const activities: Activity[] = [
  {
    href: '/experiences?category=Hiking',
    image: 'https://images.unsplash.com/photo-1756136720412-b03a99998672?fm=jpg&q=70&w=900&auto=format&fit=crop',
    alt: 'Hikers on a misty mountain trail in Sri Lanka',
    title: 'Hiking',
    description: 'Trek scenic ridgelines and misty peaks with guides who know every hidden trail.',
  },
  {
    href: '/experiences?category=Abseiling',
    image: 'https://images.unsplash.com/photo-1621693113354-8b32a9e0ba39?fm=jpg&q=70&w=900&auto=format&fit=crop',
    alt: 'Traveler abseiling down a waterfall in Sri Lanka',
    title: 'Abseiling',
    description: 'Descend cascading waterfalls with full safety gear and expert instruction.',
  },
  {
    href: '/experiences?category=Rafting',
    image: 'https://images.unsplash.com/photo-1641584495089-5914d85d9bcc?fm=jpg&q=70&w=900&auto=format&fit=crop',
    alt: 'Group rafting and kayaking down the Kelani River',
    title: 'Rafting & Kayaking',
    description: "Paddle through rapids and calm stretches alike on Sri Lanka's best rivers.",
  },
  {
    href: '/experiences?category=Hiking',
    image: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?fm=jpg&q=70&w=900&auto=format&fit=crop',
    alt: 'Campers with tents under the stars in the mountains',
    title: 'Trekking & Camping',
    description: 'Multi-day treks with camp nights under the stars, far from the crowds.',
  },
  {
    href: '/experiences?category=River%20Expedition',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?fm=jpg&q=70&w=900&auto=format&fit=crop',
    alt: 'Adventurers on a multi-day river expedition',
    title: 'River Expedition',
    description: 'Multi-day river journeys blending rapids, camping, and remote scenery.',
  },
  {
    href: '/experiences?category=Caving',
    image: 'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?fm=jpg&q=70&w=900&auto=format&fit=crop',
    alt: 'Explorer navigating a dark cave with headlamp',
    title: 'Caving',
    description: 'Explore underground chambers and passages lit only by your headlamp.',
  },
]

const AUTOPLAY_MS = 5000
const SWIPE_THRESHOLD = 40

export default function ActivitiesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }

  useEffect(() => {
    if (!isMobile) return
    stopAutoplay()
    autoplayRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % activities.length)
    }, AUTOPLAY_MS)
    return stopAutoplay
  }, [isMobile])

  const goTo = (i: number) => {
    stopAutoplay()
    setActiveIndex(((i % activities.length) + activities.length) % activities.length)
  }
  const prev = () => goTo(activeIndex - 1)
  const next = () => goTo(activeIndex + 1)

  // swipe with live drag feedback
  const onTouchStart = (e: React.TouchEvent) => {
    stopAutoplay()
    touchStartX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !trackRef.current) return
    const delta = e.touches[0].clientX - touchStartX.current
    const width = trackRef.current.offsetWidth
    // resist dragging past the first/last card
    const atStart = activeIndex === 0 && delta > 0
    const atEnd = activeIndex === activities.length - 1 && delta < 0
    const resisted = atStart || atEnd ? delta / 3 : delta
    setDragOffset((resisted / width) * 100)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    setIsDragging(false)
    setDragOffset(0)
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta < 0 ? goTo(activeIndex + 1) : goTo(activeIndex - 1)
    }
    touchStartX.current = null
  }

  const sliderStyle = isMobile
    ? {
        transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}%))`,
        transition: isDragging ? 'none' : 'transform .5s ease',
      }
    : undefined

  return (
    <div className="activities-carousel-wrap">
      <button className="activities-nav prev" onClick={prev} aria-label="Previous activity">
        ‹
      </button>

      <div className="card-scroller">
        <div
          ref={trackRef}
          className="card-scroller-track"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={sliderStyle}
        >
          {activities.map((a) => (
            <div className="activity-card" key={a.title}>
              <a href={a.href} className="activity-card-link">
                <img src={a.image} alt={a.alt} draggable={false} />
                <div className="activity-card-content glass">
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      <button className="activities-nav next" onClick={next} aria-label="Next activity">
        ›
      </button>

      <div className="activities-dots">
        {activities.map((_, i) => (
          <button
            key={i}
            className={i === activeIndex ? 'active' : ''}
            onClick={() => goTo(i)}
            aria-label={`Go to ${activities[i].title}`}
          />
        ))}
      </div>
    </div>
  )
}