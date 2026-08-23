// normalize-duration.ts
import {createClient} from '@sanity/client'
import 'dotenv/config'

const DRY_RUN = process.argv.includes('--dry-run')

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// Converts old free-text duration strings into hours.
// Extend this map if you find values beyond "X Day"/"X Days" once you see the real data.
function parseDurationToHours(raw: string): number | undefined {
  const normalized = raw.trim().toLowerCase()

  // "1 day", "2 days" -> assume a standard adventure-tourism day = 8 hours.
  // Flagged as an assumption, not fact — confirm with the client whether "1 Day" trips
  // are actually full 8-hour days or something shorter, since this number shows on the site.
  const dayMatch = normalized.match(/^(\d+(?:\.\d+)?)\s*day/)
  if (dayMatch) return parseFloat(dayMatch[1]) * 8

  const hourMatch = normalized.match(/^(\d+(?:\.\d+)?)\s*hour/)
  if (hourMatch) return parseFloat(hourMatch[1])

  return undefined // unrecognized format — left unmapped so it's visible in the log, not silently wrong
}

async function run() {
  const experiences = await sanity.fetch(
    `*[_type == "experience" && defined(durationRaw)]{_id, title, durationRaw}`
  )

  console.log(`Found ${experiences.length} experiences with durationRaw to normalize.\n`)

  for (const exp of experiences) {
    const hours = parseDurationToHours(exp.durationRaw)

    if (hours === undefined) {
      console.log(`⚠️  ${exp.title}: could not parse "${exp.durationRaw}" — needs manual fix in Studio`)
      continue
    }

    console.log(`${exp.title}: "${exp.durationRaw}" -> ${hours} hours`)

    if (DRY_RUN) continue

    await sanity
      .patch(exp._id)
      .set({durationHours: hours})
      .unset(['durationRaw'])
      .commit()
  }

  console.log(DRY_RUN ? '\nDry run complete — nothing written.' : '\nDuration normalization complete.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
