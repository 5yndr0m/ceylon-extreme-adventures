'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useMemo, useState} from 'react'
import {urlFor} from '@/lib/sanity'

type ExperienceCard = {
  _id: string
  title: string
  slug?: { current?: string }
  category?: string | null
  locationName?: string | null
  price?: number | null
  heroImage?: any
}

export default function ExperienceCategoryFilter({
  experiences,
  initialCategory = 'All',
}: {
  experiences: ExperienceCard[]
  initialCategory?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    setSelectedCategory(categoryFromUrl || 'All')
  }, [searchParams])

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      experiences
        .map((experience) => experience.category)
        .filter((category): category is string => Boolean(category))
    )

    return Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b))
  }, [experiences])

  const updateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (category === 'All') {
      params.delete('category')
    } else {
      params.set('category', category)
    }

    const nextUrl = params.toString() ? `/experiences?${params.toString()}` : '/experiences'
    router.replace(nextUrl, {scroll: false})
    setSelectedCategory(category)
  }

  const filteredExperiences =
    selectedCategory === 'All'
      ? experiences
      : experiences.filter((experience) => experience.category === selectedCategory)

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => updateCategory('All')}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'border-orange-600 bg-orange-600 text-white'
              : 'border-stone-300 bg-white text-stone-700 hover:border-orange-400 hover:text-orange-600'
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => updateCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'border-orange-600 bg-orange-600 text-white'
                : 'border-stone-300 bg-white text-stone-700 hover:border-orange-400 hover:text-orange-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredExperiences.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-stone-600">
          No experiences match this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((exp) => (
            <Link
              key={exp._id}
              href={exp.slug?.current ? `/experiences/${exp.slug.current}` : '#'}
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
                <div className="w-full h-full bg-gray-300" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs uppercase tracking-wide text-orange-400 mb-1">
                  {exp.category || 'Adventure'}
                </p>
                <h2 className="text-xl font-bold mb-1">{exp.title}</h2>
                {exp.locationName && (
                  <p className="text-sm text-white/80 mb-2">{exp.locationName}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span>From LKR {exp.price?.toLocaleString() ?? '0'}</span>
                  <span className="underline">View Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
