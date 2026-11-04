// export-experiences.ts
//
// Exports every experience from Sanity as a plain-text/markdown file (no photos) into
// migration/experience-factcheck/<slug>.md, ready to be pasted into Google Keep, shared
// with the team and fact-checked. Fixed files are then pushed back with
// upload-experiences.ts. Format + parsing live in factcheck-format.ts.
//
// Safe by default: an existing file is NEVER overwritten (it may contain someone's
// fact-check edits). Pass --overwrite to deliberately refresh files from Sanity.
//
// Exports the PUBLISHED version of each experience. If an experience has only ever
// existed as a draft (e.g. created by migrate-quickfacts.ts), the draft is exported
// instead and flagged in the log.
//
// Usage:
//   cd migration
//   npx tsx export-experiences.ts --dry-run
//   npx tsx export-experiences.ts
//   npx tsx export-experiences.ts --only=dolukanda,lakegala
//   npx tsx export-experiences.ts --overwrite
import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import {docToParsed, renderFile} from './factcheck-format'

const DRY_RUN = process.argv.includes('--dry-run')
const OVERWRITE = process.argv.includes('--overwrite')
const ONLY = (process.argv.find((a) => a.startsWith('--only='))?.slice(7) ?? '').split(',').map((s) => s.trim()).filter(Boolean)
const DIR = process.env.FACTCHECK_DIR || path.join(__dirname, 'experience-factcheck')

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

async function run() {
  console.log(DRY_RUN ? '--- DRY RUN: no files will be written ---\n' : '--- LIVE RUN ---\n')

  // Text fields only: no heroImage / gallery / video, so the export stays small.
  const docs: any[] = await sanity.fetch(`*[_type == "experience"]{
    _id, title, slug, category, difficulty, durationHours, price, maxGroupSize, locationName,
    shortDescription, activityTags, quickFacts, distancesFrom, suitableMonths, fullDescription
  }`)

  // Group the published doc and its draft (if any) under one slug; prefer published.
  const bySlug = new Map<string, {published?: any; draft?: any}>()
  for (const d of docs) {
    const slug = d.slug?.current
    if (!slug) { console.warn(`⚠️  ${d._id} has no slug — skipped`); continue }
    const entry = bySlug.get(slug) ?? {}
    if (d._id.startsWith('drafts.')) entry.draft = d; else entry.published = d
    bySlug.set(slug, entry)
  }

  if (!DRY_RUN) fs.mkdirSync(DIR, {recursive: true})
  let written = 0, skipped = 0

  for (const [slug, {published, draft}] of [...bySlug.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (ONLY.length && !ONLY.includes(slug)) continue
    const doc = published ?? draft
    const file = path.join(DIR, `${slug}.md`)

    if (fs.existsSync(file) && !OVERWRITE) {
      console.log(`⏭️  ${slug} — file already exists, kept as is (use --overwrite to replace)`)
      skipped++
      continue
    }
    const {parsed, richDescription} = docToParsed(doc)
    const notes = [!published ? 'DRAFT-ONLY (never published)' : '', published && draft ? 'has an unpublished draft too' : '', richDescription ? 'rich-text description' : '']
      .filter(Boolean).join(', ')
    console.log(`📝 ${slug}${notes ? `  [${notes}]` : ''}`)
    if (!DRY_RUN) fs.writeFileSync(file, renderFile(parsed, richDescription), 'utf-8')
    written++
  }

  for (const s of ONLY) if (!bySlug.has(s)) console.warn(`⚠️  --only: no experience with slug "${s}"`)
  console.log(`\nDone. ${written} file(s) ${DRY_RUN ? 'would be ' : ''}written, ${skipped} kept.${DRY_RUN ? '' : `\nFolder: ${DIR}`}`)
}

run().catch((err) => { console.error(err); process.exit(1) })
