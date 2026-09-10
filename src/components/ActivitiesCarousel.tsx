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
    href: '/experiences?category=Abseiling',
    image: 'https://cdn.sanity.io/images/b5qf24u0/production/d47059c095a0841443e13a0a5ef244011c89a75f-1000x563.jpg?w=900&auto=format',
    alt: 'Abseiler descending Laxapana Falls in Sri Lanka',
    title: 'Abseiling',
    description: 'Descend cascading waterfalls with full safety gear and expert instruction.',
  },
  {
    href: '/experiences?category=Hiking',
    image: 'https://cdn.sanity.io/images/b5qf24u0/production/9d6c3f75ad68c4f2d280f885227a431811fa18d3-800x1000.jpg?w=900&auto=format',
    alt: 'Hiker overlooking the valley from Yahangala',
    title: 'Hiking',
    description: 'Trek scenic ridgelines and misty peaks with guides who know every hidden trail.',
  },
  {
    // Category value is "Camping & Trekking" — previously mis-linked to category=Hiking,
    // which meant this card and the Hiking card above pointed at the same filtered list.
    href: '/experiences?category=Camping%20%26%20Trekking',
    image: 'https://cdn.sanity.io/images/b5qf24u0/production/3e7986011b8f4b3e2f83f488e2fa17f582357d97-800x1000.jpg?w=900&auto=format',
    alt: "Trekking group descending the ridge at Devil's Staircase",
    title: 'Trekking & Camping',
    description: 'Multi-day treks with camp nights under the stars, far from the crowds.',
  },
  {
    href: '/experiences?category=Rafting',
    image: 'https://cdn.sanity.io/images/b5qf24u0/production/0f2e1ddd73aba46ba6557314455200c1d99493d6-800x1000.jpg?w=900&auto=format',
    alt: 'Rafters running whitewater rapids on the Kelani River',
    title: 'Rafting & Kayaking',
    description: "Paddle through rapids and calm stretches alike on Sri Lanka's best rivers.",
  },
  {
    href: '/experiences?category=Canyoning',
    image: 'https://cdn.sanity.io/images/b5qf24u0/production/7bbe71a3c1f9d1e6c36be04c0b9253ce71310b31-1000x1000.jpg?w=900&auto=format',
    alt: 'Canyoners sliding down a natural rock waterfall at Katarang Oya',
    title: 'Canyoning',
    description: 'Slide, jump, and abseil your way down river gorges carved into the rainforest.',
  },
  {
    href: '/experiences?category=River%20Expedition',
    image: 'https://cdn.sanity.io/images/b5qf24u0/production/babdbfde5d88f193fa95bf04add3ca313553e34b-1000x563.jpg?w=900&auto=format',
    alt: 'Kayaks paddling down the Mahaweli River on a multi-day expedition',
    title: 'River Expedition',
    description: 'Multi-day river journeys blending rapids, camping, and remote scenery.',
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