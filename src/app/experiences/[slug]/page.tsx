// src/app/experiences/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getExperienceBySlug, urlFor} from '@/lib/sanity'
import ExperienceTabs from './ExperienceTabs'

export const revalidate = 60

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const exp = await getExperienceBySlug(slug)
  if (!exp) return {}

  const description =
    exp.shortDescription || `${exp.category ?? 'Adventure'} experience${exp.locationName ? ` in ${exp.locationName}` : ''} with Ceylon Extreme Adventures.`
  const image = exp.heroImage ? urlFor(exp.heroImage).width(1200).height(630).url() : undefined

  return {
    title: exp.title,
    description,
    openGraph: {title: exp.title, description, ...(image ? {images: [{url: image, width: 1200, height: 630, alt: exp.title}]} : {})},
    twitter: {title: exp.title, description, ...(image ? {images: [image]} : {})},
  }
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const exp = await getExperienceBySlug(slug)
  if (!exp) return notFound()

  const gallery = (exp.gallery || []).slice(0, 4)

  return (
    <main className="bp-page">
      <div className="container bp-top">
        <div className="bp-breadcrumb">
          <Link href="/">Home</Link> / <Link href="/experiences">Experiences</Link> / <span>{exp.title}</span>
        </div>
        <h1 className="bp-title">{exp.title}</h1>
        <div className="bp-subline">
          {exp.category && <span className="bp-tag">{exp.category}</span>}
          {exp.status === 'new' && <span className="bp-new-badge">New</span>}
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

      <ExperienceTabs exp={exp} />

      {/* ================= MOBILE STICKY CTA ================= */}
      <div className="bp-mobile-cta">
        <a href="#book" className="btn btn-primary">Enquire Now</a>
      </div>
    </main>
  )
}