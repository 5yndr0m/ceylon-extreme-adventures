// src/app/experiences/[slug]/page.tsx
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {getExperienceBySlug, urlFor} from '@/lib/sanity'
import {PortableText} from '@portabletext/react' // npm install @portabletext/react
import BookingForm from './BookingForm'

export const revalidate = 60

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
const RATING_STYLES: Record<string, string> = {
  best: 'bg-green-100 text-green-800',
  ok: 'bg-yellow-100 text-yellow-800',
  worst: 'bg-red-100 text-red-800',
}
const RATING_LABEL: Record<string, string> = {best: 'Best', ok: 'Ok', worst: 'Worst'}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const exp = await getExperienceBySlug(slug)
  if (!exp) return notFound()

  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] w-full">
        {exp.heroImage && (
          <Image
            src={urlFor(exp.heroImage).width(1600).height(900).url()}
            alt={exp.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-7xl mx-auto">
          <p className="text-orange-400 text-sm uppercase tracking-wide mb-2">
            {exp.category}
            {exp.status === 'new' && (
              <span className="ml-2 text-white bg-orange-500 px-2 py-0.5 rounded-full text-xs normal-case tracking-normal align-middle">
                New
              </span>
            )}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">{exp.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-wrap gap-6 text-sm border-y py-4">
            <div>
              <span className="text-gray-500 block">Difficulty</span>
              <span className="font-semibold">{exp.difficulty}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Duration</span>
              <span className="font-semibold">{exp.durationHours} hours</span>
            </div>
            {exp.locationName && (
              <div>
                <span className="text-gray-500 block">Location</span>
                <span className="font-semibold">{exp.locationName}</span>
              </div>
            )}
            {exp.maxGroupSize && (
              <div>
                <span className="text-gray-500 block">Max Group Size</span>
                <span className="font-semibold">{exp.maxGroupSize} people</span>
              </div>
            )}
          </div>

          {exp.activityTags && exp.activityTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exp.activityTags.map((tag: string) => (
                <span key={tag} className="text-xs uppercase tracking-wide bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {exp.suitableMonths && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Suitable Months</h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
                {MONTHS.map(({key, label}) => {
                  const rating = exp.suitableMonths[key]
                  if (!rating) return null
                  return (
                    <div
                      key={key}
                      className={`text-center text-sm font-medium py-2 rounded ${RATING_STYLES[rating] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {label}
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                {(['best', 'ok', 'worst'] as const).map((r) => (
                  <span key={r} className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-sm inline-block ${RATING_STYLES[r]}`} />
                    {RATING_LABEL[r]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {exp.quickFacts && exp.quickFacts.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Quick Facts</h2>
              <dl className="border rounded-xl divide-y overflow-hidden">
                {exp.quickFacts.map((fact: {label: string; value: string}, i: number) => (
                  <div key={i} className="flex justify-between gap-4 px-4 py-3 text-sm odd:bg-gray-50">
                    <dt className="text-gray-500">{fact.label}</dt>
                    <dd className="font-medium text-right">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              {exp.distancesFrom && exp.distancesFrom.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  {exp.distancesFrom.map((d: {location: string; km: number}) => (
                    <span key={d.location}>
                      <span className="font-medium text-gray-900">{d.location}</span> {d.km} km
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="prose max-w-none">
            {exp.fullDescription ? (
              <PortableText value={exp.fullDescription} />
            ) : (
              // Fallback while full descriptions are still being backfilled from the old site —
              // remove this branch once every experience has fullDescription populated
              <p>{exp.shortDescription || 'Full description coming soon.'}</p>
            )}
          </div>

          {exp.gallery && exp.gallery.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {exp.gallery.map((img: {_key?: string; alt?: string} & Record<string, unknown>, i: number) => (
                  <a
                    key={img._key ?? i}
                    href={urlFor(img).width(1600).url()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-[4/3] rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={urlFor(img).width(600).height(450).url()}
                      alt={img.alt || `${exp.title} photo ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {exp.guide && (
            <div className="flex items-center gap-4 border-t pt-6">
              {exp.guide.photo && (
                <Image
                  src={urlFor(exp.guide.photo).width(80).height(80).url()}
                  alt={exp.guide.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold">{exp.guide.name}</p>
                <p className="text-sm text-gray-500">{exp.guide.bio}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: sticky booking panel */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="border rounded-xl p-6 shadow-sm">
            <p className="text-2xl font-bold mb-1">
              LKR {exp.price?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-6">per person</p>
            {/* Client component — needs interactivity for date/group size/submit */}
            <BookingForm experienceId={exp._id} experienceTitle={exp.title} />
          </div>
        </div>
      </div>
    </main>
  )
}
