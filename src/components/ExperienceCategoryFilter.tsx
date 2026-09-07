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

type ViewMode = 'grid' | 'list'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

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

  // Highest price across all experiences — used to bound the price slider
  const priceCeiling = useMemo(() => {
    const prices = experiences.map((e) => e.price ?? 0)
    return prices.length > 0 ? Math.max(...prices) : 0
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

  const filteredExperiences = experiences
    .filter((experience) =>
      selectedCategory === 'All' ? true : experience.category === selectedCategory
    )
    .filter((experience) =>
      searchQuery.trim()
        ? experience.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          (experience.locationName ?? '').toLowerCase().includes(searchQuery.trim().toLowerCase())
        : true
    )
    .filter((experience) =>
      maxPrice !== null ? (experience.price ?? 0) <= maxPrice : true
    )

  return (
    <>
      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-3">
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

      {/* Search + price filter + view toggle row */}
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-stone-200 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or location..."
              className="w-full rounded-full border border-stone-300 bg-white py-2 pl-9 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Price filter */}
          <div className="flex items-center gap-3 sm:min-w-[220px]">
            <label htmlFor="price-filter" className="whitespace-nowrap text-sm font-medium text-stone-600">
              Max price
            </label>
            <input
              id="price-filter"
              type="range"
              min={0}
              max={priceCeiling || 1}
              step={500}
              value={maxPrice ?? priceCeiling}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="flex-1 accent-orange-600"
            />
            <span className="whitespace-nowrap text-sm text-stone-700">
              {maxPrice !== null ? `≤ LKR ${maxPrice.toLocaleString()}` : 'Any'}
            </span>
            {maxPrice !== null && (
              <button
                type="button"
                onClick={() => setMaxPrice(null)}
                className="text-xs text-orange-600 underline whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Grid / List view toggle */}
        <div className="flex items-center gap-1 self-start rounded-full border border-stone-300 bg-white p-1 sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-stone-600 hover:text-orange-600'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="List view"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-stone-600 hover:text-orange-600'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            List
          </button>
        </div>
      </div>

      {filteredExperiences.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-stone-600">
          No experiences match your filters.
        </div>
      ) : viewMode === 'grid' ? (
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
                <div className="flex items-center justify-end text-sm">
                  <span className="underline">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredExperiences.map((exp) => (
            <Link
              key={exp._id}
              href={exp.slug?.current ? `/experiences/${exp.slug.current}` : '#'}
              className="group flex gap-5 rounded-xl border border-stone-200 bg-white p-3 hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="relative h-32 w-32 sm:h-36 sm:w-48 flex-shrink-0 overflow-hidden rounded-lg">
                {exp.heroImage ? (
                  <Image
                    src={urlFor(exp.heroImage).width(400).height(400).url()}
                    alt={exp.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>

              <div className="flex flex-1 flex-col justify-center py-1">
                <p className="text-xs uppercase tracking-wide text-orange-600 font-semibold mb-1">
                  {exp.category || 'Adventure'}
                </p>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">{exp.title}</h2>
                {exp.locationName && (
                  <p className="text-sm text-stone-500 mb-2">{exp.locationName}</p>
                )}
                <div className="mt-auto flex items-center justify-end text-sm">
                  <span className="text-orange-600 underline">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}