// src/app/experiences/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import {getAllExperiences, urlFor} from '@/lib/sanity'

export const revalidate = 60 // ISR: re-fetch from Sanity at most once a minute

// Matches the real activity taxonomy confirmed during migration (see migrate-experiences.ts)
const CATEGORIES = ['Hiking', 'Rafting', 'Canyoning', 'Abseiling', 'Kayaking', 'Caving', 'River Expedition']

type ExperienceSummary = {
  _id: string
  title: string
  slug: {current: string}
  category?: string
  difficulty?: string
  durationHours?: number
  price?: number
  locationName?: string
  heroImage?: any
}

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{category?: string}>
}) {
  const {category} = await searchParams
  const experiences: ExperienceSummary[] = await getAllExperiences()
  const filtered = category
    ? experiences.filter((exp) => exp.category === category)
    : experiences

  return (
    <main className="bg-[#f5f2ea] min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-orange-600 text-sm font-semibold tracking-wide uppercase mb-2">
          What We Run
        </p>
        <h1 className="text-4xl font-bold mb-6">All Experiences</h1>

        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/experiences"
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              !category ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-300 text-gray-700 hover:border-orange-400'
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/experiences?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                category === cat ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-300 text-gray-700 hover:border-orange-400'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-gray-500 mb-10">No experiences in this category yet — check back soon or browse all experiences.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exp) => (
            <Link
              key={exp._id}
              href={`/experiences/${exp.slug.current}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] block"
            >
              {exp.heroImage ? (
                <Image
                  src={urlFor(exp.heroImage).width(600).height(750).url()}
                  alt={exp.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-300" /> // fallback for the 0 experiences still missing images, if any
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs uppercase tracking-wide text-orange-400 mb-1">
                  {exp.category}
                </p>
                <h2 className="text-xl font-bold mb-1">{exp.title}</h2>
                {exp.locationName && (
                  <p className="text-sm text-white/80 mb-2">{exp.locationName}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span>From LKR {exp.price?.toLocaleString()}</span>
                  <span className="underline">View Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
