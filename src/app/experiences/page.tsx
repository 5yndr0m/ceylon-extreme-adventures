import {Suspense} from 'react'
import {getAllExperiences} from '@/lib/sanity'
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
    <main className="min-h-screen bg-[var(--mist-white)]">
      <section className="reveal-on-load relative overflow-hidden bg-[var(--jungle-green)] px-6 pb-14 pt-32 text-white md:pb-20">
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[2.5px] text-[var(--adrenaline-orange)]">
            What We Run
          </p>
          <h1 className="mb-4 max-w-3xl text-4xl font-normal uppercase tracking-wide md:text-6xl">
            All Experiences
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Choose your next way into Sri Lanka&apos;s rivers, waterfalls, trails, and wild places.
          </p>
        </div>
        <div className="absolute -bottom-16 -right-12 h-48 w-48 rounded-full border-[24px] border-[var(--adrenaline-orange)]/20 md:h-72 md:w-72" />
        <div className="absolute right-24 top-10 h-3 w-3 rounded-full bg-[var(--adrenaline-orange)] md:right-36 md:top-20" />
      </section>

      <section className="reveal-on-load mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="mb-8 h-1 w-16 rounded-full bg-[var(--adrenaline-orange)]" />

        <Suspense fallback={null}>
          <ExperienceCategoryFilter experiences={experiences} initialCategory="All" />
        </Suspense>
      </section>
    </main>
  )
}
