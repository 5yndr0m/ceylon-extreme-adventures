'use client'

import { useEffect, useRef, useState } from 'react'
import { monthlyEvents } from '@/data/monthlyEvents'

const AUTOPLAY_MS = 5000
const VISIBLE_DESKTOP = 3

export default function MonthlyEventFlyers() {
  const [activeMonthId, setActiveMonthId] = useState<string | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeMonth = monthlyEvents.find((m) => m.id === activeMonthId) || null
  const perView = isDesktop ? VISIBLE_DESKTOP : 1
  const maxIndex = activeMonth ? Math.max(0, activeMonth.events.length - perView) : 0

  // track desktop breakpoint
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 960)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const openMonth = (id: string) => {
    setActiveMonthId(id)
    setSlideIndex(0)
  }
  const closeModal = () => setActiveMonthId(null)

  const goTo = (i: number) => {
    if (!activeMonth) return
    const clamped = ((i % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1)
    setSlideIndex(clamped)
  }
  const next = () => goTo(slideIndex + 1)
  const prev = () => goTo(slideIndex - 1)

  // autoplay — restarts whenever the modal opens, the month changes, or breakpoint changes
  useEffect(() => {
    if (!activeMonth) return
    stopAutoplay()
    if (activeMonth.events.length > perView) {
      autoplayRef.current = setInterval(() => {
        setSlideIndex((i) => {
          const nextMax = Math.max(0, activeMonth.events.length - perView)
          return i >= nextMax ? 0 : i + 1
        })
      }, AUTOPLAY_MS)
    }
    return stopAutoplay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMonth, perView])

  function stopAutoplay() {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }

  // manual nav pauses autoplay for the rest of this modal session
  const handleManualNav = (fn: () => void) => {
    stopAutoplay()
    fn()
  }

  // close on Escape, lock body scroll while modal open
  useEffect(() => {
    if (!activeMonth) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowRight') handleManualNav(next)
      if (e.key === 'ArrowLeft') handleManualNav(prev)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMonth, slideIndex])

  return (
    <>
      <div className="monthly-flyers-grid">
        {monthlyEvents.slice(0, 3).map((month) => (
          <button
            key={month.id}
            className="monthly-flyer-card"
            onClick={() => openMonth(month.id)}
            aria-label={`View ${month.month} events`}
          >
            <img src={month.flyerImage} alt={`${month.month} events flyer`} />
            <div className="monthly-flyer-overlay">
              <span className="monthly-flyer-month">{month.month}</span>
              <span className="monthly-flyer-count">{month.events.length} Events</span>
            </div>
          </button>
        ))}
      </div>

      {activeMonth && (
        <div className="event-modal-backdrop" onClick={closeModal}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <div>
                <span className="eyebrow">{activeMonth.month} Events</span>
                <h2>Upcoming Departures</h2>
              </div>
              <button className="event-modal-close" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="event-carousel">
              <button
                className="event-nav prev"
                onClick={() => handleManualNav(prev)}
                aria-label="Previous event"
                disabled={maxIndex === 0}
              >
                ‹
              </button>

              <div className="event-carousel-viewport">
                <div
                  className="event-carousel-track"
                  style={{
                    transform: `translateX(-${(slideIndex * 100) / perView}%)`,
                    width: `${(activeMonth.events.length / perView) * 100}%`,
                  }}
                >
                  {activeMonth.events.map((ev) => (
                    <div
                      key={ev.id}
                      className="event-carousel-slide"
                      style={{ width: `${100 / activeMonth.events.length}%` }}
                    >
                      <div className="event-carousel-img">
                        <img src={ev.image} alt={ev.title} />
                        <span className="event-carousel-date">{ev.date}</span>
                      </div>
                      <div className="event-carousel-body">
                        <span className="tag">{ev.category}</span>
                        <h3>{ev.title}</h3>
                        <p className="event-carousel-desc">{ev.description}</p>
                        <div className="event-carousel-price">{ev.price}</div>
                        <a href="/contact" className="btn btn-primary">
                          Reserve Spot →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="event-nav next"
                onClick={() => handleManualNav(next)}
                aria-label="Next event"
                disabled={maxIndex === 0}
              >
                ›
              </button>
            </div>

            {maxIndex > 0 && (
              <div className="event-carousel-dots">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    className={i === slideIndex ? 'active' : ''}
                    onClick={() => handleManualNav(() => goTo(i))}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}