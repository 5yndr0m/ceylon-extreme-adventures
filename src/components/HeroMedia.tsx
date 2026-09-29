'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

type NetworkInformation = { saveData?: boolean; effectiveType?: string }

export default function HeroMedia({ posterUrl, videoUrl }: { posterUrl: string; videoUrl: string }) {
  const reducedMotion = useReducedMotion()
  const [allowVideo, setAllowVideo] = useState(false)

  // The poster is already the section background, so the 5MB video is an enhancement:
  // skip it on data-saver / slow connections and only start fetching once the page has loaded.
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
    const constrained = connection?.saveData || /(^|-)(2g|3g)$/.test(connection?.effectiveType ?? '')
    if (constrained) return
    const start = () => setAllowVideo(true)
    if (document.readyState === 'complete') {
      start()
      return
    }
    window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [])

  const showVideo = allowVideo && !reducedMotion

  useEffect(() => {
    if (showVideo) window.dispatchEvent(new Event('resize'))
  }, [showVideo])

  return (
    <>
      <div className="hero-bg" style={{ backgroundImage: `url(${posterUrl})` }}>
        {showVideo && (
          <video autoPlay muted loop playsInline preload="metadata" poster={posterUrl} aria-hidden="true">
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
        <div className="overlay"></div>
      </div>
    </>
  )
}
