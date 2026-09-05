// update-descriptions.ts
//
// Patches `shortDescription` and `fullDescription` on drafts, from
// data/descriptions.json. Nothing else on the document is touched — in
// particular, `suitableMonths` is never read or written by this script.
//
// Only covers the 30 experiences sourced from the CEA Experience Guide PDF.
// Deliberately excludes the 4 pre-existing Rafting docs that were never part
// of that set (beginner-rafting-canyoning, extreme-rafting-canyoning,
// full-day-rafting, whitewater-rafting) — there's no fact-checked source
// data for those, so rewriting their copy here would just be guessing.
//
// The descriptions were fact-checked against each experience's quickFacts
// before being written. Three real inconsistencies turned up in the source
// PDF between its narrative text and its own Quick Facts table — resolved
// by treating quickFacts as authoritative:
//   - Kithal Ella: narrative said a 23m cascade; quickFacts lists Abseiling
//     Height as 265 ft (81m). The 23m figure is dropped from the description.
//   - Mannakethi Ella: narrative described a ~110ft "grand finale" abseil;
//     quickFacts lists Abseiling Height as 70 ft. Description uses 70 ft.
//   - Nonpareil Falls: narrative claimed heights "10m to 90m"; quickFacts'
//     4 listed heights (65/195/98/32 ft) only span ~10-59m. Description uses
//     the actual range from quickFacts.
//
// This finds each experience by slug and patches whichever revision is
// currently editable (draft if one exists, published doc's own draft
// otherwise — Sanity creates that draft automatically, exactly like the
// earlier quickFacts/photos scripts). Nothing is published.
//
// Usage:
//   cd migration
//   npm install
//   npx tsx update-descriptions.ts --dry-run
//   npx tsx update-descriptions.ts

import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const DRY_RUN = process.argv.includes('--dry-run')

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

type DescriptionEntry = {
  shortDescription: string
  fullDescription: string[] // one string per paragraph
}

function toPortableText(paragraphs: string[]) {
  return paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `block${i}`,
    style: 'normal',
    children: [{_type: 'span', _key: `span${i}`, text}],
    markDefs: [],
  }))
}

async function run() {
  const dataPath = path.join(__dirname, 'data', 'descriptions.json')
  const data: Record<string, DescriptionEntry> = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  console.log(`Loaded descriptions for ${Object.keys(data).length} experiences.`)
  console.log(DRY_RUN ? '--- DRY RUN: no writes will be made ---\n' : '--- LIVE RUN ---\n')

  let updated = 0
  let missing = 0

  for (const [slug, entry] of Object.entries(data)) {
    const existing = await sanity.fetch<{_id: string} | null>(
      `*[_type == "experience" && slug.current == $slug][0]{_id}`,
      {slug}
    )
    if (!existing) {
      console.warn(`⚠️  No experience found for slug "${slug}" — skipping.`)
      missing++
      continue
    }

    console.log(`✏️  ${slug} — updating shortDescription + fullDescription`)
    if (!DRY_RUN) {
      await sanity
        .patch(existing._id)
        .set({
          shortDescription: entry.shortDescription,
          fullDescription: toPortableText(entry.fullDescription),
        })
        .commit()
    }
    updated++
  }

  console.log(`\nDone. ${updated} updated, ${missing} not found${DRY_RUN ? ' (dry run — nothing written)' : ''}.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
