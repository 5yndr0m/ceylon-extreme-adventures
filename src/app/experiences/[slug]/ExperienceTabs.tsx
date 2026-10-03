// src/app/experiences/[slug]/ExperienceTabs.tsx
'use client'

import {useState} from 'react'
import Link from 'next/link'
import Image from '@/components/SanityImage'
import {PortableText} from '@portabletext/react'
import {urlFor, monthSlugFor} from '@/lib/sanity'
import InquiryForm from './InquiryForm'

const MAX_DEPARTURES_SHOWN = 4

function formatDepartureDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})
}

const MONTHS: {key: string; label: string}[] = [
  {key: 'jan', label: 'Jan'},
  {key: 'feb', label: 'Feb'},
  {key: 'mar', label: 'Mar'},
  {key: 'apr', label: 'Apr'},
  {key: 'may', label: 'May'},
  {key: 'jun', label: 'Jun'},
  {key: 'jul', label: 'Jul'},
  {key: 'aug', label: 'Aug'},
  {key: 'sep', label: 'Sep'},
  {key: 'oct', label: 'Oct'},
  {key: 'nov', label: 'Nov'},
  {key: 'dec', label: 'Dec'},
]

// Matches the guide's Best/Ok/Worst legend colors
const RATING_LABEL: Record<string, string> = {best: 'Best', ok: 'Ok', worst: 'Worst'}

type TabKey = 'overview' | 'facts' | 'gallery' | 'included' | 'guide'

export default function ExperienceTabs({exp}: {exp: any}) {
  const fullGallery = exp.gallery || []
  const hasQuickFacts = exp.quickFacts && exp.quickFacts.length > 0
  const hasFactsTab = hasQuickFacts || exp.suitableMonths

  const tabs: {key: TabKey; label: string}[] = [
    {key: 'overview', label: 'Overview'},
    ...(hasFactsTab ? [{key: 'facts' as const, label: 'Quick Facts'}] : []),
    ...(fullGallery.length > 0 ? [{key: 'gallery' as const, label: 'Gallery'}] : []),
    {key: 'included', label: "What's included"},
    ...(exp.guide ? [{key: 'guide' as const, label: 'Your guide'}] : []),
  ]

  const [active, setActive] = useState<TabKey>('overview')

  // Standard ARIA tabs keyboard pattern: arrow keys move focus and activate the
  // newly-focused tab (automatic activation), Home/End jump to the ends.
  function handleTabKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((t) => t.key === active)
    let nextIndex: number | null = null
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') nextIndex = 0
    else if (e.key === 'End') nextIndex = tabs.length - 1
    if (nextIndex === null) return
    e.preventDefault()
    const nextTab = tabs[nextIndex]
    setActive(nextTab.key)
    document.getElementById(`tab-${nextTab.key}`)?.focus()
  }

  return (
    <>
      <div className="bp-tabbar">
        <div className="container bp-tabbar-inner" role="tablist" aria-label="Experience details" onKeyDown={handleTabKeyDown}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={active === tab.key}
              aria-controls={`panel-${tab.key}`}
              tabIndex={active === tab.key ? 0 : -1}
              className={`bp-tab ${active === tab.key ? 'active' : ''}`}
              onClick={() => setActive(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container bp-grid">
        <div className="bp-main">
          {active === 'overview' && (
            <section className="bp-section" role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" tabIndex={0}>
              <h2>Overview</h2>
              <div className="bp-facts-row">
                <div className="bp-fact-pill">
                  <span className="bp-fact-pill-label">Duration</span>
                  <span className="bp-fact-pill-value">{exp.durationHours ? `${exp.durationHours} hrs` : '—'}</span>
                </div>
                <div className="bp-fact-pill">
                  <span className="bp-fact-pill-label">Group size</span>
                  <span className="bp-fact-pill-value">{exp.maxGroupSize ? `Up to ${exp.maxGroupSize}` : 'Flexible'}</span>
                </div>
                <div className="bp-fact-pill">
                  <span className="bp-fact-pill-label">Difficulty</span>
                  <span className="bp-fact-pill-value">{exp.difficulty || '—'}</span>
                </div>
              </div>

              {exp.activityTags && exp.activityTags.length > 0 && (
                <div className="bp-tags">
                  {exp.activityTags.map((tag: string) => (
                    <span key={tag} className="bp-activity-tag">{tag}</span>
                  ))}
                </div>
              )}

              <div className="bp-prose">
                {exp.fullDescription ? (
                  <PortableText value={exp.fullDescription} />
                ) : (
                  <p>{exp.shortDescription || 'Full description coming soon — call us for the details.'}</p>
                )}
              </div>
            </section>
          )}

          {active === 'facts' && hasFactsTab && (
            <section className="bp-section" role="tabpanel" id="panel-facts" aria-labelledby="tab-facts" tabIndex={0}>
              {hasQuickFacts && (
                <>
                  <h2>Quick Facts</h2>
                  <dl className="bp-quickfacts">
                    {exp.quickFacts.map((fact: {label: string; value: string}, i: number) => (
                      <div key={i} className="bp-quickfacts-row">
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {exp.distancesFrom && exp.distancesFrom.length > 0 && (
                    <div className="bp-distances">
                      {exp.distancesFrom.map((d: {location: string; km: number}) => (
                        <span key={d.location} className="bp-distance-item">
                          <strong>{d.location}</strong> {d.km} km
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}

              {exp.suitableMonths && (
                <>
                  {hasQuickFacts ? (
                    <h3 className="bp-section-subhead">Best months to visit</h3>
                  ) : (
                    <h2>Best months to visit</h2>
                  )}
                  <div className="bp-months-grid">
                    {MONTHS.map(({key, label}) => {
                      const rating = exp.suitableMonths[key]
                      if (!rating) return null
                      return (
                        <div key={key} className={`bp-month-cell bp-month-${rating}`}>
                          {label}
                        </div>
                      )
                    })}
                  </div>
                  <div className="bp-months-legend">
                    {(['best', 'ok', 'worst'] as const).map((r) => (
                      <span key={r} className="bp-months-legend-item">
                        <span className={`bp-months-legend-swatch bp-month-${r}`} />
                        {RATING_LABEL[r]}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {active === 'gallery' && fullGallery.length > 0 && (
            <section className="bp-section" role="tabpanel" id="panel-gallery" aria-labelledby="tab-gallery" tabIndex={0}>
              <h2>Gallery</h2>
              <div className="bp-gallery-grid">
                {fullGallery.map((img: {_key?: string; alt?: string; dims?: {width: number; height: number}} & Record<string, unknown>, i: number) => {
                  // Real aspect ratio per photo (falls back to a 4:3 guess for the rare
                  // asset with no metadata) instead of forcing every tile to the same
                  // shape — portrait and landscape shots now each keep their own frame.
                  const ratio = img.dims ? img.dims.width / img.dims.height : 4 / 3
                  return (
                    <a
                      key={img._key ?? i}
                      href={urlFor(img).width(1600).url()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bp-gallery-item"
                      style={{aspectRatio: ratio}}
                    >
                      <Image
                        src={urlFor(img).width(700).url()}
                        alt={img.alt || `${exp.title} photo ${i + 1}`}
                        fill
                        sizes="(min-width: 768px) 33vw, 50vw"
                        className="object-cover"
                      />
                    </a>
                  )
                })}
              </div>
            </section>
          )}

          {active === 'included' && (
            <section className="bp-section" role="tabpanel" id="panel-included" aria-labelledby="tab-included" tabIndex={0}>
              <h2>What's included</h2>
              <ul className="bp-included-list">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4z"/><path d="m9 12 2 2 4-4"/></svg>
                  Certified guide and full safety briefing
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Gear checked before every departure
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h4l3 8 4-16 3 8h4"/></svg>
                  Free reschedule if weather turns unsafe
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  Transport from the agreed meeting point
                </li>
              </ul>
            </section>
          )}

          {active === 'guide' && exp.guide && (
            <section className="bp-section" role="tabpanel" id="panel-guide" aria-labelledby="tab-guide" tabIndex={0}>
              <h2>Your guide</h2>
              <div className="bp-guide-card">
                {exp.guide.portraitImage && (
                  <Image
                    src={urlFor(exp.guide.portraitImage).width(160).height(160).url()}
                    alt={exp.guide.name}
                    width={72}
                    height={72}
                    className="bp-guide-photo"
                  />
                )}
                <div>
                  <p className="bp-guide-name">{exp.guide.name}</p>
                  {exp.guide.bio && <p className="bp-guide-bio">{exp.guide.bio}</p>}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* -------- Sticky inquiry card -------- */}
        <aside className="bp-book-col" id="book">
          <div className="bp-book-card">
            <div className="bp-departures">
              <p className="bp-departures-title">Upcoming departures</p>
              {exp.upcomingEvents && exp.upcomingEvents.length > 0 ? (
                <ul className="bp-departures-list">
                  {exp.upcomingEvents.slice(0, MAX_DEPARTURES_SHOWN).map((event: {_id: string; slug: string; date: string; price: number}) => (
                    <li key={event._id}>
                      <Link href={`/events/${monthSlugFor(new Date(event.date))}/${event.slug}`} className="bp-departure-row">
                        <span className="bp-departure-date">{formatDepartureDate(event.date)}</span>
                        <span className="bp-departure-price">LKR {event.price.toLocaleString()}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="bp-departures-empty">
                  No fixed departures scheduled right now — send an enquiry below and we&apos;ll arrange a date.
                </p>
              )}
              {exp.upcomingEvents && exp.upcomingEvents.length > MAX_DEPARTURES_SHOWN && (
                <p className="bp-departures-empty" style={{marginTop: 8}}>
                  +{exp.upcomingEvents.length - MAX_DEPARTURES_SHOWN} more — ask us below for the full schedule.
                </p>
              )}
            </div>

            <InquiryForm experienceTitle={exp.title} />
            <p className="bp-book-note">We&apos;ll reply within 1 business day</p>
          </div>
        </aside>
      </div>
    </>
  )
}
