'use client'

import Image from '@/components/SanityImage'
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
  heroImage?: any
  levelGroup?: string | null
  levelName?: string | null
  levelOrder?: number | null
  levelGroupSummary?: string | null
}

type Level = {_id: string; name: string; slug: string}

// One list entry: either a normal experience, or several experiences that share a level group
type ListItem = {
  key: string
  title: string
  category?: string | null
  locationName?: string | null
  heroImage?: any
  summary?: string | null
  slug?: string
  levels?: Level[]
}

function toListItems(experiences: ExperienceCard[]): ListItem[] {
  const items: ListItem[] = []
  const groups = new Map<string, ExperienceCard[]>()
  for (const exp of experiences) {
    if (exp.levelGroup) {
      groups.set(exp.levelGroup, [...(groups.get(exp.levelGroup) ?? []), exp])
    } else {
      items.push({
        key: exp._id,
        title: exp.title,
        category: exp.category,
        locationName: exp.locationName,
        heroImage: exp.heroImage,
        slug: exp.slug?.current,
      })
    }
  }
  groups.forEach((members, group) => {
    const ordered = [...members].sort((a, b) => (a.levelOrder ?? 99) - (b.levelOrder ?? 99))
    const first = ordered[0]
    items.push({
      key: `group-${group}`,
      title: group,
      category: first.category,
      locationName: first.locationName,
      heroImage: ordered.find((m) => m.heroImage)?.heroImage,
      summary: first.levelGroupSummary,
      levels: ordered
        .filter((m) => m.slug?.current)
        .map((m) => ({_id: m._id, name: m.levelName || m.title, slug: m.slug!.current!})),
    })
  })
  return items.sort((a, b) => a.title.localeCompare(b.title))
}

type ViewMode = 'grid' | 'list'

function LevelChips({exp, tone}: {exp: ListItem; tone: 'dark' | 'light'}) {
  const base =
    tone === 'dark'
      ? 'border border-white/60 bg-black/30 text-white hover:bg-white hover:text-stone-900'
      : 'border border-stone-300 bg-white text-stone-800 hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]'
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={`${exp.title} levels`}>
      {exp.levels!.map((level) => (
        <Link
          key={level._id}
          href={`/experiences/${level.slug}`}
          className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold transition-colors ${base}`}
        >
          {level.name}
        </Link>
      ))}
    </div>
  )
}

function GridCard({exp}: {exp: ListItem}) {
  const image = exp.heroImage ? (
    <Image
      src={urlFor(exp.heroImage).width(600).height(750).url()}
      alt={exp.levels ? '' : exp.title}
      fill
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover group-hover:scale-105 transition-transform duration-300"
    />
  ) : (
    <div className="w-full h-full bg-gray-300" />
  )
  const meta = (
    <>
      <p className="text-xs uppercase tracking-wide text-[var(--accent-on-dark)] mb-1">{exp.category || 'Adventure'}</p>
      <h2 className="text-xl font-bold mb-1">{exp.title}</h2>
      {exp.locationName && <p className="text-sm text-white/80 mb-2">{exp.locationName}</p>}
    </>
  )

  if (exp.levels) {
    return (
      <div className="group relative rounded-xl overflow-hidden aspect-[4/5]">
        {image}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          {meta}
          {exp.summary && <p className="text-sm text-white/85 mb-3">{exp.summary}</p>}
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80 mb-2">Choose your level</p>
          <LevelChips exp={exp} tone="dark" />
        </div>
      </div>
    )
  }

  return (
    <Link
      href={exp.slug ? `/experiences/${exp.slug}` : '#'}
      className="group relative rounded-xl overflow-hidden aspect-[4/5] block"
    >
      {image}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        {meta}
        <div className="flex items-center justify-end text-sm">
          <span className="underline">View Details</span>
        </div>
      </div>
    </Link>
  )
}

function ListRow({exp}: {exp: ListItem}) {
  const thumb = (
    <div className="relative h-32 w-32 sm:h-36 sm:w-48 flex-shrink-0 overflow-hidden rounded-lg">
      {exp.heroImage ? (
        <Image
          src={urlFor(exp.heroImage).width(400).height(400).url()}
          alt={exp.levels ? '' : exp.title}
          fill
          sizes="192px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gray-300" />
      )}
    </div>
  )
  const heading = (
    <>
      <p className="text-xs uppercase tracking-wide text-[var(--accent-ink)] font-semibold mb-1">{exp.category || 'Adventure'}</p>
      <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">{exp.title}</h2>
      {exp.locationName && <p className="text-sm text-stone-500 mb-2">{exp.locationName}</p>}
    </>
  )

  if (exp.levels) {
    return (
      <div className="group flex gap-5 rounded-xl border border-stone-200 bg-white p-3">
        {thumb}
        <div className="flex flex-1 flex-col justify-center py-1">
          {heading}
          {exp.summary && <p className="text-sm text-stone-600 mb-3">{exp.summary}</p>}
          <LevelChips exp={exp} tone="light" />
        </div>
      </div>
    )
  }

  return (
    <Link
      href={exp.slug ? `/experiences/${exp.slug}` : '#'}
      className="group flex gap-5 rounded-xl border border-stone-200 bg-white p-3 hover:border-[var(--blue-4)] hover:shadow-md transition-all"
    >
      {thumb}
      <div className="flex flex-1 flex-col justify-center py-1">
        {heading}
        <div className="mt-auto flex items-center justify-end text-sm">
          <span className="text-[var(--accent-ink)] underline">View Details</span>
        </div>
      </div>
    </Link>
  )
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
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    setSelectedCategory(categoryFromUrl || 'All')
  }, [searchParams])

  const listItems = useMemo(() => toListItems(experiences), [experiences])

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

  // A homepage card can link to more than one category at once (e.g. "Rafting & Kayaking"
  // -> category=Rafting,Kayaking) since some categories only have a single experience and
  // aren't worth their own card — comma-separated values here are matched as an OR.
  const selectedCategories = selectedCategory.split(',').map((c) => c.trim())

  const filteredExperiences = listItems
    .filter((experience) =>
      selectedCategory === 'All' ? true : !!experience.category && selectedCategories.includes(experience.category)
    )
    .filter((experience) =>
      searchQuery.trim()
        ? experience.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          (experience.locationName ?? '').toLowerCase().includes(searchQuery.trim().toLowerCase())
        : true
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
              ? 'border-[var(--accent-action)] bg-[var(--accent-action)] text-white'
              : 'border-stone-300 bg-white text-stone-700 hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]'
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
              selectedCategories.includes(category)
                ? 'border-[var(--accent-action)] bg-[var(--accent-action)] text-white'
                : 'border-stone-300 bg-white text-stone-700 hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search + view toggle row */}
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
              className="w-full rounded-full border border-stone-300 bg-white py-2 pl-9 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-action)]"
            />
          </div>
        </div>

        {/* Grid / List view toggle */}
        <div className="flex items-center gap-1 self-start rounded-full border border-stone-300 bg-white p-1 sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-[var(--accent-action)] text-white' : 'text-stone-600 hover:text-[var(--accent-ink)]'
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
              viewMode === 'list' ? 'bg-[var(--accent-action)] text-white' : 'text-stone-600 hover:text-[var(--accent-ink)]'
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
            <GridCard key={exp.key} exp={exp} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredExperiences.map((exp) => (
            <ListRow key={exp.key} exp={exp} />
          ))}
        </div>
      )}
    </>
  )
}