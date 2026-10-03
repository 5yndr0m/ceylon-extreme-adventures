import {Suspense} from 'react'
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
// requests in the same second. ExperienceCategoryFilter is a client component that
// already reads the ?category= URL param itself via useSearchParams() in a useEffect
// (see its own file) -- initialCategory here is purely a same-frame default to avoid
// a flash of "All" before that effect runs, not the source of truth. Hardcoding it
// lets this page be a normal static/ISR page again.
//
// Removing the server-side searchParams read means Next.js now attempts full static
// generation for this page -- which requires wrapping ExperienceCategoryFilter's
// useSearchParams() call in a Suspense boundary, or the build fails outright with
// "useSearchParams() should be wrapped in a suspense boundary". Confirmed by actually
// running `next build` locally, not just tsc/eslint -- neither of those exercises the
// static-generation path where this specific error surfaces.
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
          <Suspense fallback={null}>
            <ExperienceCategoryFilter experiences={experiences} initialCategory="All" />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
