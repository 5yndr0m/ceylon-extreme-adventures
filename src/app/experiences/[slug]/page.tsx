// src/app/experiences/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getExperienceBySlug, urlFor} from '@/lib/sanity'
import {PortableText} from '@portabletext/react'
import BookingForm from './BookingForm'

export const revalidate = 60

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const exp = await getExperienceBySlug(slug)
  if (!exp) return notFound()

  const gallery = (exp.gallery || []).slice(0, 4)
  const perPerson = exp.price != null ? `LKR ${exp.price.toLocaleString()}` : 'Contact us'

  return (
    <main className="bp-page">
      <div className="container bp-top">
        <div className="bp-breadcrumb">
          <Link href="/">Home</Link> / <Link href="/experiences">Experiences</Link> / <span>{exp.title}</span>
        </div>
        <h1 className="bp-title">{exp.title}</h1>
        <div className="bp-subline">
          {exp.category && <span className="bp-tag">{exp.category}</span>}
          {exp.locationName && (
            <span className="bp-sub-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
              {exp.locationName}
            </span>
          )}
          {exp.difficulty && (
            <span className="bp-sub-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
              {exp.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* ================= PHOTO GRID ================= */}
      <div className="container">
        <div className="bp-photogrid">
          <div className="bp-photo-main">
            {exp.heroImage ? (
              <Image
                src={urlFor(exp.heroImage).width(1200).height(900).url()}
                alt={exp.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="bp-photo-fallback" />
            )}
          </div>
          <div className="bp-photo-side">
            {gallery.length > 0 ? (
              gallery.map((img: any, i: number) => (
                <div className="bp-photo-thumb" key={i}>
                  <Image
                    src={urlFor(img).width(500).height(500).url()}
                    alt={`${exp.title} photo ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="bp-photo-thumb bp-photo-fallback" />
            )}
          </div>
        </div>
      </div>

      {/* ================= TABS (anchor links, no JS needed) ================= */}
      <div className="bp-tabbar">
        <div className="container bp-tabbar-inner">
          <a href="#overview">Overview</a>
          <a href="#included">What's included</a>
          {exp.guide && <a href="#guide">Your guide</a>}
          <a href="#book">Book</a>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="container bp-grid">
        <div className="bp-main">
          <section id="overview" className="bp-section">
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

          <section id="included" className="bp-section">
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

          {exp.guide && (
            <section id="guide" className="bp-section">
              <h2>Your guide</h2>
              <div className="bp-guide-card">
                {exp.guide.photo && (
                  <Image
                    src={urlFor(exp.guide.photo).width(160).height(160).url()}
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

        {/* -------- Sticky booking card -------- */}
        <aside className="bp-book-col" id="book">
          <div className="bp-book-card">
            <div className="bp-book-price">
              <span className="bp-book-amount">{perPerson}</span>
              <span className="bp-book-unit">per person</span>
            </div>
            <BookingForm experienceId={exp._id} experienceTitle={exp.title} unitPrice={exp.price ?? 0} />
            <p className="bp-book-note">Reply within 1 business day · No payment until confirmed</p>
          </div>
        </aside>
      </div>

      {/* ================= MOBILE STICKY CTA ================= */}
      <div className="bp-mobile-cta">
        <div>
          <span className="bp-mobile-amount">{perPerson}</span>
          <span className="bp-mobile-unit">per person</span>
        </div>
        <a href="#book" className="btn btn-primary">Book Now</a>
      </div>
    </main>
  )
}