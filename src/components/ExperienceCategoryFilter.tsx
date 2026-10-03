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

function ExperienceCard({exp}: {exp: ListItem}) {
  const image = exp.heroImage ? (
    <Image
      src={urlFor(exp.heroImage).width(700).height(525).url()}
      alt={exp.levels ? '' : exp.title}
      fill
      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
      className="object-cover"
    />
  ) : (
    <div className="exp-card-img-fallback" />
  )

  const body = (
    <div className="exp-card-body">
      <span className="tag">{exp.category || 'Adventure'}</span>
      <h3>{exp.title}</h3>
      {exp.locationName && (
        <span className="exp-card-location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {exp.locationName}
        </span>
      )}
      {exp.summary && <p className="exp-card-summary">{exp.summary}</p>}

      {exp.levels ? (
        <div className="exp-card-footer">
          <p className="exp-card-levels-label">Choose your level</p>
          <div className="exp-level-chips" role="group" aria-label={`${exp.title} levels`}>
            {exp.levels.map((level) => (
              <Link key={level._id} href={`/experiences/${level.slug}`} className="exp-level-chip">
                {level.name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="exp-card-footer">
          <span className="view-link">View Details</span>
        </div>
      )}
    </div>
  )

  if (exp.levels) {
    return (
      <article className="exp-card">
        <div className="exp-card-img">{image}</div>
        {body}
      </article>
    )
  }

  return (
    <Link href={exp.slug ? `/experiences/${exp.slug}` : '#'} className="exp-card">
      <div className="exp-card-img">{image}</div>
      {body}
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
      <div className="exp-toolbar">
        <div className="exp-filters" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => updateCategory('All')}
            className={`exp-filter-pill ${selectedCategory === 'All' ? 'active' : ''}`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => updateCategory(category)}
              className={`exp-filter-pill ${selectedCategories.includes(category) ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="exp-search-wrap">
          <label htmlFor="exp-search" className="sr-only">
            Search experiences by name or location
          </label>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="exp-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or location…"
            className="exp-search"
          />
        </div>
      </div>

      {filteredExperiences.length === 0 ? (
        <div className="exp-empty">No experiences match your filters.</div>
      ) : (
        <div className="exp-grid">
          {filteredExperiences.map((exp) => (
            <ExperienceCard key={exp.key} exp={exp} />
          ))}
        </div>
      )}
    </>
  )
}
