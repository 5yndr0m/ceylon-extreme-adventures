// src/lib/sanity.ts
import {createClient} from '@sanity/client'
import {createImageUrlBuilder} from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true, // fine for public read-only queries; listing/detail pages don't need fresh-write consistency
})

const builder = createImageUrlBuilder(client)
export function urlFor(source: any) {
  return builder.image(source)
}

// One row per experience card — keep this lean, listing pages don't need fullDescription
export async function getAllExperiences() {
  return client.fetch(`
    *[_type == "experience"] | order(title asc) {
      _id,
      title,
      slug,
      category,
      difficulty,
      durationHours,
      price,
      locationName,
      heroImage
    }
  `)
}

// Full detail for a single experience page
export async function getExperienceBySlug(slug: string) {
  return client.fetch(
    `
    *[_type == "experience" && slug.current == $slug][0] {
      _id,
      title,
      category,
      difficulty,
      durationHours,
      price,
      locationName,
      shortDescription,
      fullDescription,
      heroImage,
      gallery,
      guide->{name, photo, bio, phone}
    }
  `,
    {slug}
  )
}
