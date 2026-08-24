// src/app/experiences/[slug]/page.tsx
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {getExperienceBySlug, urlFor} from '@/lib/sanity'
import {PortableText} from '@portabletext/react' // npm install @portabletext/react
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
          </div>

          <div className="prose max-w-none">
            {exp.fullDescription ? (
              <PortableText value={exp.fullDescription} />
            ) : (
              // Fallback while full descriptions are still being backfilled from the old site —
              // remove this branch once every experience has fullDescription populated
              <p>{exp.shortDescription || 'Full description coming soon.'}</p>
            )}
          </div>

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
