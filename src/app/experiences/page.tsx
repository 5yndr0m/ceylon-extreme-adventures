// src/app/experiences/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import {getAllExperiences, urlFor} from '@/lib/sanity'

export const revalidate = 60 // ISR: re-fetch from Sanity at most once a minute

export default async function ExperiencesPage() {
  const experiences = await getAllExperiences()

  return (
    <main className="bg-[#f5f2ea] min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-orange-600 text-sm font-semibold tracking-wide uppercase mb-2">
          What We Run
        </p>
        <h1 className="text-4xl font-bold mb-10">All Experiences</h1>

        {/* Filters can be added here later (category/difficulty) once you have a client component
            wrapping this list — kept server-rendered for now since it's the fastest path to "working" */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp: any) => (
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
