import type {MetadataRoute} from 'next'
import {client, getAllExperiences, getAllPosts, getLeadershipProfiles, monthSlugFor} from '@/lib/sanity'

const BASE_URL = 'https://extremeadventure.lk'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [experiences, posts, profiles, events] = await Promise.all([
    getAllExperiences(),
    getAllPosts(),
    getLeadershipProfiles(),
    client.fetch<{slug?: {current?: string}; date?: string}[]>(
      `*[_type == "event" && defined(slug.current) && defined(date)]{slug, date}`
    ),
  ])

  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = ['', '/about', '/contact', '/experiences', '/blog', '/terms'].map(
    (path) => ({url: `${BASE_URL}${path}`, lastModified: now})
  )

  const experienceRoutes: MetadataRoute.Sitemap = experiences
    .filter((e: {slug?: {current?: string}}) => e.slug?.current)
    .map((e: {slug?: {current?: string}}) => ({url: `${BASE_URL}/experiences/${e.slug!.current}`, lastModified: now}))

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p: {slug?: {current?: string}}) => p.slug?.current)
    .map((p: {slug?: {current?: string}}) => ({url: `${BASE_URL}/blog/${p.slug!.current}`, lastModified: now}))

  const profileRoutes: MetadataRoute.Sitemap = profiles
    .filter((pr: {slug?: {current?: string}}) => pr.slug?.current)
    .map((pr: {slug?: {current?: string}}) => ({url: `${BASE_URL}/about/team/${pr.slug!.current}`, lastModified: now}))

  const validEvents = events.filter((ev) => ev.slug?.current && ev.date)

  const eventRoutes: MetadataRoute.Sitemap = validEvents.map((ev) => ({
    url: `${BASE_URL}/events/${monthSlugFor(new Date(ev.date!))}/${ev.slug!.current}`,
    lastModified: now,
  }))

  // Each month that has at least one event also gets its own listing page
  const monthSlugs = Array.from(new Set(validEvents.map((ev) => monthSlugFor(new Date(ev.date!)))))
  const monthRoutes: MetadataRoute.Sitemap = monthSlugs.map((month) => ({
    url: `${BASE_URL}/events/${month}`,
    lastModified: now,
  }))

  return [...staticRoutes, ...experienceRoutes, ...postRoutes, ...profileRoutes, ...monthRoutes, ...eventRoutes]
}
