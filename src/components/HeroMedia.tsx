'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

type NetworkInformation = { saveData?: boolean; effectiveType?: string }

export default function HeroMedia({
  posterUrl,
  videoUrl,
  videoMp4Url,
}: {
  posterUrl: string
  videoUrl: string // WebM (VP9): smallest file, used by Chrome/Firefox/Edge/Android
  videoMp4Url: string // H.264 MP4: fallback for Safari / iOS
}) {
  const reducedMotion = useReducedMotion()
  const [allowVideo, setAllowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // The poster is already the section background, so the video is an enhancement:
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

  // iOS Safari only honours autoplay if `muted` is set as a DOM property, not just the
  // attribute (React doesn't always reflect it). Low Power Mode still blocks autoplay
  // outright; in that case play() rejects and the poster stays visible as the background.
  useEffect(() => {
    const v = videoRef.current
    if (!showVideo || !v) return
    v.muted = true
    v.play().catch(() => {})
  }, [showVideo])

  return (
    <>
      <div className="hero-bg" style={{ backgroundImage: `url(${posterUrl})` }}>
        {showVideo && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterUrl}
            aria-hidden="true"
          >
            {/* Order matters: the browser plays the first source it can decode. Browsers
                that support VP9 WebM take the smaller file; Safari versions that can't
                decode it skip to the MP4. */}
            <source src={videoUrl} type='video/webm; codecs="vp9"' />
            <source src={videoMp4Url} type="video/mp4" />
          </video>
        )}
        <div className="overlay"></div>
      </div>
    </>
  )
}
