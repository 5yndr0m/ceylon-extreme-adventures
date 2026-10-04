import Link from 'next/link'
import Image from '@/components/SanityImage'
import {getAllExperiences, DEFAULT_HERO_IMAGE_URL} from '@/lib/sanity'
import ExperienceCategoryFilter from '@/components/ExperienceCategoryFilter'

export const revalidate = 60

// Deliberately not reading `searchParams` here. In the App Router, a page that reads
// searchParams is forced into fully dynamic (server-rendered-per-request) mode --
// the `revalidate` export above is silently ignored the moment that happens, so this
// page was hitting Sanity fresh on every single request (bot, prefetch, or otherwise),
// confirmed via Vercel runtime logs showing 100% cache=MISS and bursts of a dozen+
// requests in the same second. initialCategory here is purely a same-frame default;
// ExperienceCategoryFilter reads the real ?category= value client-side from
// window.location (not next/navigation's useSearchParams -- that hook would force
// this whole component to exist only inside a Suspense fallback in the static HTML,
// which is exactly what made the live page's entire card grid invisible until JS
// hydrated. See that file's own comment for the full story.)
export const metadata = {
  title: 'Experiences',
  description: 'Browse waterfall abseiling, whitewater rafting, canyoning, hiking, and kayaking adventures across Sri Lanka.',
}

export default async function ExperiencesPage() {
  const experiences = await getAllExperiences()

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-bg">
          <Image src={DEFAULT_HERO_IMAGE_URL} alt="" fill priority sizes="100vw" />
          <div className="overlay"></div>
        </div>
        <div className="container page-hero-inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <span>Experiences</span>
          </div>
          <span className="eyebrow" style={{color: 'var(--accent-text)'}}>What we run</span>
          <h1>All Experiences</h1>
          <p className="page-hero-sub body-lg">
            Choose your next way into Sri Lanka&apos;s rivers, waterfalls, trails, and wild places.
          </p>
        </div>
      </section>

      <section className="exp-list">
        <div className="container" style={{paddingTop: 48, paddingBottom: 64}}>
          <ExperienceCategoryFilter experiences={experiences} initialCategory="All" />
        </div>
      </section>
    </main>
  )
}
