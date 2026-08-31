// migrate-experiences.ts
import mysql from 'mysql2/promise'
import {createClient} from '@sanity/client'
import {unserialize} from 'php-unserialize'
import 'dotenv/config'

const DRY_RUN = process.argv.includes('--dry-run')

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// The 24 real experience post IDs confirmed from wp_posts
const EXPERIENCE_IDS = [
  5732, 5776, 5819, 5942, 5970, 6028, 6061, 6102, 6125, 6142, 6167, 6194,
  6218, 6242, 6259, 6280, 6307, 6329, 6352, 6389, 6420, 6447, 6467, 7540,
]

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function parsePrice(raw?: string): number | undefined {
  if (!raw) return undefined
  const cleaned = raw.replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? undefined : num
}

function mapDifficulty(raw?: string): string | undefined {
  if (!raw) return undefined
  const normalized = raw.trim().toLowerCase()
  const map: Record<string, string> = {
    chill: 'Easy',
    easy: 'Easy',
    moderate: 'Moderate',
    tough: 'Challenging',
    challenging: 'Challenging',
    extreme: 'Extreme',
    hard: 'Challenging',
  }
  return map[normalized] ?? raw.trim() // unmapped values still pass through so nothing is silently dropped — check the console output for anything outside this map
}

function mapCategory(raw?: string): string | undefined {
  if (!raw) return undefined
  const normalized = raw.trim().toLowerCase()
  // Matches the real activity taxonomy found in the old wp_posts 'acitivities' custom post type,
  // NOT the placeholder list Hiking/Rafting/Climbing/Diving/Wildlife/Cultural that was in the schema
  // before this data existed. Update experienceType.ts's category options list to match this set.
  if (normalized.includes('hik') || normalized.includes('trek')) return 'Hiking'
  if (normalized.includes('raft')) return 'Rafting'
  if (normalized.includes('canyon')) return 'Canyoning'
  if (normalized.includes('abseil') || normalized.includes('waterfall')) return 'Abseiling'
  if (normalized.includes('kayak')) return 'Kayaking'
  if (normalized.includes('cav')) return 'Caving'
  if (normalized.includes('river') || normalized.includes('expedition')) return 'River Expedition'
  if (normalized.includes('dive') || normalized.includes('diving')) return 'Diving'
  if (normalized.includes('wildlife')) return 'Wildlife'
  return undefined // still unmapped after this — flag manually in Studio rather than guess
}

function safeUnserializeArray(raw?: string): string[] {
  if (!raw) return []
  try {
    const result = unserialize(raw)
    if (Array.isArray(result)) return result
    if (typeof result === 'object' && result !== null) return Object.values(result)
    return []
  } catch {
    return []
  }
}

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })

  const [posts] = await conn.query<any[]>(
    `SELECT ID, post_title FROM wp_posts WHERE ID IN (${EXPERIENCE_IDS.join(',')})`
  )

  for (const post of posts) {
    const [metaRows] = await conn.query<any[]>(
      `SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ? AND meta_key NOT LIKE '\\_%'`,
      [post.ID]
    )

    const meta: Record<string, string> = {}
    for (const row of metaRows) meta[row.meta_key] = row.meta_value

    // Resolve featured image URL via _thumbnail_id -> attachment post -> guid
    const [thumbRows] = await conn.query<any[]>(
      `SELECT p2.guid FROM wp_postmeta p1
       JOIN wp_posts p2 ON p2.ID = p1.meta_value
       WHERE p1.post_id = ? AND p1.meta_key = '_thumbnail_id'`,
      [post.ID]
    )
    const heroImageUrl = thumbRows[0]?.guid

    const activities = safeUnserializeArray(meta['included_activities'])
    const locations = safeUnserializeArray(meta['location'])

    const title = meta['experience_name'] || post.post_title
    const doc = {
      _id: `experience-${post.ID}`, // deterministic id = safe to re-run
      _type: 'experience',
      title,
      slug: {_type: 'slug', current: slugify(title)},
      category: mapCategory(meta['experience_category']),
      difficulty: mapDifficulty(meta['difficulty']),
      durationRaw: meta['duration'], // keep raw string too; normalize to hours manually later
      price: parsePrice(meta['price_in_lkr']),
      locationName: locations[0] || undefined,
      // Both fields are now in the schema (see experienceType.ts) — backfilled below.
      // meta['max_group_size'] is a raw string in WP; coerce to a number and drop if unparseable
      // rather than writing NaN into Sanity.
      maxGroupSize: meta['max_group_size'] ? parseInt(meta['max_group_size'], 10) || undefined : undefined,
      activityTags: activities.length > 0 ? activities : undefined,
      heroImageSourceUrl: heroImageUrl, // temp field: re-upload to Sanity assets in a follow-up pass
      migratedFromWpId: post.ID,
    }

    if (DRY_RUN) {
      console.log(JSON.stringify(doc, null, 2))
      continue
    }

    await sanity.createOrReplace(doc)
    console.log(`✅ Migrated: ${title} (wp_id ${post.ID})`)
  }

  await conn.end()
  console.log(DRY_RUN ? '\nDry run complete — no data written.' : '\nMigration complete.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
