import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import {getProfileBySlug, urlFor} from '@/lib/sanity'

export const revalidate = 60

type Profile = {
  name: string
  role?: string
  portraitImage?: unknown
  coverImage?: unknown
  bio?: string
  longDescription?: unknown[]
  specialties?: string[]
  email?: string
  phone?: string
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const profile: Profile | null = await getProfileBySlug(slug)
  if (!profile) return {}

  const description = profile.bio || `${profile.role ?? 'Team member'} at Ceylon Extreme Adventures.`
  const heroImage = profile.coverImage || profile.portraitImage
  const image = heroImage ? urlFor(heroImage).width(1200).height(630).url() : undefined

  return {
    title: profile.name,
    description,
    openGraph: {title: profile.name, description, ...(image ? {images: [{url: image, width: 1200, height: 630, alt: profile.name}]} : {})},
    twitter: {title: profile.name, description, ...(image ? {images: [image]} : {})},
  }
}

export default async function FounderProfilePage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const profile: Profile | null = await getProfileBySlug(slug)
  if (!profile) return notFound()

  const heroImage = profile.coverImage || profile.portraitImage

  return (
    <main>
      <section className="profile-hero">
        <div className="profile-hero-bg">
          {heroImage ? (
            <Image
              src={urlFor(heroImage).width(1800).height(1000).url()}
              alt=""
              fill
              priority
              className="object-cover"
            />
          ) : null}
          <div className="overlay" />
        </div>
        <div className="container profile-hero-inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/about#team">About Us</Link> / <span>{profile.name}</span>
          </div>
          <span className="eyebrow">Meet the team</span>
          <h1>{profile.name}</h1>
          {profile.role && <p className="profile-role">{profile.role}</p>}
        </div>
      </section>

      <section className="profile-content">
        <div className="container profile-grid">
          <div className="profile-portrait-wrap">
            {profile.portraitImage ? (
              <Image
                src={urlFor(profile.portraitImage).width(760).height(950).url()}
                alt={`${profile.name}, ${profile.role || 'Ceylon Extreme Adventures team member'}`}
                width={760}
                height={950}
                className="profile-portrait"
              />
            ) : (
              <div className="profile-portrait profile-portrait-fallback" aria-hidden="true" />
            )}
          </div>
          <article className="profile-copy">
            <span className="eyebrow">The person behind the adventure</span>
            <h2>{profile.name}&apos;s story</h2>
            {profile.bio && <p className="profile-bio body-lg">{profile.bio}</p>}
            {profile.longDescription && profile.longDescription.length > 0 && (
              <div className="prose profile-long-description">
                <PortableText value={profile.longDescription as never} />
              </div>
            )}
            {!profile.bio && (!profile.longDescription || profile.longDescription.length === 0) && (
              <p>More about this team member is coming soon.</p>
            )}
            <Link href="/about#team" className="profile-back"><span aria-hidden="true">←</span> Back to the team</Link>
          </article>

          <aside className="profile-aside">
            <span className="eyebrow">Profile details</span>
            <h2>Areas Of Expertise</h2>
            {profile.specialties && profile.specialties.length > 0 && (
              <div className="profile-specialties">
                {profile.specialties.map((specialty) => (
                  <span className="profile-specialty" key={specialty}>{specialty}</span>
                ))}
              </div>
            )}
            {!profile.specialties?.length && <p className="profile-empty">Specialties will be added soon.</p>}
            {(profile.email || profile.phone) && (
              <div className="profile-contact">
                {profile.email && <a href={`mailto:${profile.email}`}><span>Email</span>{profile.email}</a>}
                {profile.phone && <a href={`tel:${profile.phone}`}><span>Phone / WhatsApp</span>{profile.phone}</a>}
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}
