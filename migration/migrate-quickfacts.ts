// migrate-quickfacts.ts
//
// Backfills `quickFacts`, `suitableMonths`, and `distancesFrom` for every experience
// described in the CEA Experience Guide PDF (data/pdf-experience-data.json, 30 entries)
// — including the ones that never made it into Sanity from the original WordPress
// migration (Camping & Trekking, Canyoning, and Rafting & Kayaking didn't exist as
// sections on the old site at all).
//
// This script does NOT touch images — heroImage/gallery are being added manually in
// Studio with higher-quality photos, not the PDF's low-res embedded ones. It's text
// data only: quick facts, the suitable-months rating, and reference distances.
//
// This script is idempotent and safe to re-run:
//   - Matched against the real Sanity slug — either the PDF's own slug key, or an
//     explicit `matchSlug` override in the data file where the two differ (confirmed
//     by diffing against the actual *[_type=="experience"]{title,"slug":slug.current}
//     output — 10 of the 24 existing docs use different slugs/spellings than the PDF,
//     e.g. "diyaluma" vs "diyaluma-falls", "kuvenigala" vs "kuwenigala").
//   - Existing experiences: quickFacts / suitableMonths / distancesFrom are patched in,
//     overwriting any previous value for those three fields only — nothing else on the
//     document is touched. `status` is set to "active" only if not already set.
//   - Missing experiences: created as DRAFTS (drafts.<id>) with status "new", not
//     published directly. They'll need: a price (LKR — not in the PDF, still an open
//     question with the client on per-person vs flat-rate pricing), a hero/gallery
//     image, and a fullDescription, all added manually in Studio before publishing.
//   - Rafting/Kayaking (Kithulgala Rafting Adventure, Full Day Rafting - Kelani River,
//     Kala Wewa Kayaking) are SKIPPED — see SKIP_SLUGS below for why.
//
// Usage:
//   cd migration
//   npm install   (if not already)
//   npx tsx migrate-quickfacts.ts --dry-run
//   npx tsx migrate-quickfacts.ts

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

type QuickFact = {label: string; value: string}
type DistanceEntry = {location: string; km: number}
type MonthsMap = Record<string, 'best' | 'ok' | 'worst'>

type PdfExperience = {
  title: string
  category: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme'
  isNew: boolean // informational hint only — actual existence is checked live, see header comment
  matchSlug?: string // set when the PDF's slug guess doesn't match the real Sanity slug — see data file
  quickFacts: QuickFact[]
  distancesFrom: DistanceEntry[]
  suitableMonths: MonthsMap
}

// The 3 Rafting/Kayaking entries below are deliberately left out of this run. The 24
// existing experiences include 4 Rafting docs (beginner-rafting-canyoning,
// extreme-rafting-canyoning, full-day-rafting, whitewater-rafting) that don't map 1:1
// onto the PDF's 3 (Kithulgala Rafting Adventure, Full Day Rafting - Kelani River,
// Kala Wewa Kayaking) — activity overlap suggests full-day-rafting <-> Full Day Rafting
// - Kelani River and whitewater-rafting <-> Kithulgala Rafting Adventure, but that's a
// guess, not a confirmed match, and beginner-/extreme-rafting-canyoning have no PDF
// equivalent at all (possibly retired combo packages). Rather than risk overwriting the
// wrong document, these are skipped here — mark old ones "retired" and new ones "new"
// by hand in Studio once you've decided how they map, using the exported markdown as
// reference.
const SKIP_SLUGS = new Set(['kithulgala-rafting-adventure', 'full-day-rafting-kelani-river', 'kala-wewa-kayaking'])

async function run() {
  const dataPath = path.join(__dirname, 'data', 'pdf-experience-data.json')
  const data: Record<string, PdfExperience> = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  console.log(`Loaded ${Object.keys(data).length} experiences from the PDF extraction.`)
  console.log(DRY_RUN ? '--- DRY RUN: no writes will be made ---\n' : '--- LIVE RUN ---\n')

  let patched = 0
  let created = 0
  let skipped = 0

  for (const [slug, exp] of Object.entries(data)) {
    if (SKIP_SLUGS.has(slug)) {
      console.log(`⏭️  ${exp.title}  (${slug}) — skipped, see Rafting note in this file's header comment`)
      skipped++
      continue
    }

    const lookupSlug = exp.matchSlug ?? slug
    const existing = await sanity.fetch<{_id: string} | null>(
      `*[_type == "experience" && slug.current == $slug][0]{_id}`,
      {slug: lookupSlug}
    )

    if (existing) {
      // ---- PATCH existing document — quickFacts/suitableMonths/distancesFrom only ----
      // status is set with setIfMissing so a status you've already assigned by hand is
      // never clobbered by re-running this script.
      console.log(`✏️  ${exp.title}  (${lookupSlug}) — patching quickFacts/suitableMonths/distancesFrom`)
      if (!DRY_RUN) {
        await sanity
          .patch(existing._id)
          .set({
            quickFacts: exp.quickFacts,
            suitableMonths: exp.suitableMonths,
            distancesFrom: exp.distancesFrom,
          })
          .setIfMissing({status: 'active'})
          .commit()
      }
      patched++
    } else {
      // ---- CREATE new document (as a draft — needs price, images, description) ----
      console.log(`🆕 ${exp.title}  (${slug}) — no existing doc found, creating as DRAFT (text fields only)`)
      const doc = {
        _id: `drafts.experience-${slug}`,
        _type: 'experience',
        title: exp.title,
        slug: {_type: 'slug', current: slug},
        category: exp.category,
        difficulty: exp.difficulty,
        status: 'new',
        quickFacts: exp.quickFacts,
        suitableMonths: exp.suitableMonths,
        distancesFrom: exp.distancesFrom,
        // price, heroImage, gallery, fullDescription intentionally omitted —
        // price isn't in the PDF, images are being sourced separately, and
        // descriptions may be hand-edited rather than pulled verbatim from the PDF
      }
      if (!DRY_RUN) await sanity.createIfNotExists(doc as any)
      created++
    }
  }

  console.log(`\nDone. ${patched} patched, ${created} created, ${skipped} skipped${DRY_RUN ? ' (dry run — nothing written)' : ''}.`)
  if (created > 0 && !DRY_RUN) {
    console.log(`\n⚠️  ${created} new experience(s) were created as DRAFTS. Before publishing each, add in Studio:`)
    console.log(`   - price (LKR)`)
    console.log(`   - heroImage + gallery`)
    console.log(`   - fullDescription`)
    console.log(`   - coordinates (needed for the trip-planner routing graph)`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
