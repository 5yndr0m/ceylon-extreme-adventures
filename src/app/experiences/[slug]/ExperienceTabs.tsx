// src/app/experiences/[slug]/ExperienceTabs.tsx
'use client'

import {useState} from 'react'
import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {urlFor} from '@/lib/sanity'
import InquiryForm from './InquiryForm'

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

  return (
    <>
      <div className="bp-tabbar">
        <div className="container bp-tabbar-inner">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
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
            <section className="bp-section">
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
            <section className="bp-section">
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
                  <h2 className={hasQuickFacts ? 'bp-section-subhead' : undefined}>Best months to visit</h2>
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
            <section className="bp-section">
              <h2>Gallery</h2>
              <div className="bp-gallery-grid">
                {fullGallery.map((img: {_key?: string; alt?: string} & Record<string, unknown>, i: number) => (
                  <a
                    key={img._key ?? i}
                    href={urlFor(img).width(1600).url()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bp-gallery-item"
                  >
                    <Image
                      src={urlFor(img).width(600).height(450).url()}
                      alt={img.alt || `${exp.title} photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </a>
                ))}
              </div>
            </section>
          )}

          {active === 'included' && (
            <section className="bp-section">
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
            <section className="bp-section">
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
            <InquiryForm experienceTitle={exp.title} />
            <p className="bp-book-note">We&apos;ll reply within 1 business day</p>
          </div>
        </aside>
      </div>
    </>
  )
}
