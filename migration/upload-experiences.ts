// upload-experiences.ts
//
// Pushes the fact-checked files in migration/experience-factcheck/<slug>.md back to
// Sanity as DRAFTS (drafts.<id>) on the existing experience with the same slug. Nothing
// goes live until someone reviews and clicks Publish in Studio.
//
// How it stays safe:
//   - File name = slug. The "Slug:" line inside must match the file name or the file is
//     rejected, so a mis-pasted file can never overwrite a different experience.
//   - Never creates experiences — an unknown slug is an error.
//   - Only fields that actually CHANGED vs the current version are touched; photos,
//     reviews data, coordinates, level settings etc. are copied over untouched. Files
//     with no changes are skipped (no needless drafts).
//   - A file with any format error is skipped entirely and the problems are listed.
//   - If a draft already exists it is used as the base (so in-progress Studio edits in
//     other fields aren't lost); otherwise the published doc is.
//   - Editing the Description rebuilds it as plain paragraphs / "###" headings / "-"
//     bullets. If the live one had bold/links, you get a warning first.
//
// Usage:
//   cd migration
//   npx tsx upload-experiences.ts --dry-run     (shows exactly what would change)
//   npx tsx upload-experiences.ts
//   npx tsx upload-experiences.ts --only=dolukanda
import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import {applyChanges, changedFields, docToParsed, parseFile} from './factcheck-format'

const DRY_RUN = process.argv.includes('--dry-run')
const ONLY = (process.argv.find((a) => a.startsWith('--only='))?.slice(7) ?? '').split(',').map((s) => s.trim()).filter(Boolean)
const DIR = process.env.FACTCHECK_DIR || path.join(__dirname, 'experience-factcheck')

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const short = (v: unknown) => {
  const s = typeof v === 'string' ? v : JSON.stringify(v)
  const flat = (s ?? '').replace(/\s+/g, ' ')
  return flat.length > 90 ? `${flat.slice(0, 90)}…` : flat || '(empty)'
}

async function run() {
  if (!fs.existsSync(DIR)) { console.error(`❌ Folder not found: ${DIR}\nRun export-experiences.ts first.`); process.exit(1) }
  console.log(DRY_RUN ? '--- DRY RUN: nothing will be written ---\n' : '--- LIVE RUN: writing drafts ---\n')

  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()
  let drafted = 0, unchanged = 0, failed = 0

  for (const file of files) {
    const slug = file.replace(/\.md$/, '')
    if (ONLY.length && !ONLY.includes(slug)) continue

    const {parsed, errors} = parseFile(fs.readFileSync(path.join(DIR, file), 'utf-8'))
    if (!parsed) {
      console.error(`❌ ${file} — not uploaded, fix these first:\n${errors.map((e) => `     • ${e}`).join('\n')}`)
      failed++
      continue
    }
    if (parsed.slug !== slug) {
      console.error(`❌ ${file} — the Slug line says "${parsed.slug}" but the file is named "${slug}". Not uploaded.`)
      failed++
      continue
    }

    const found: any[] = await sanity.fetch(`*[_type == "experience" && slug.current == $slug]`, {slug})
    const published = found.find((d) => !d._id.startsWith('drafts.'))
    const draft = found.find((d) => d._id.startsWith('drafts.'))
    const base = draft ?? published
    if (!base) {
      console.error(`❌ ${file} — no experience with slug "${slug}" exists in Sanity. Not uploaded (this script never creates new ones).`)
      failed++
      continue
    }

    const {parsed: current, richDescription} = docToParsed(base)
    const changed = changedFields(current, parsed)
    if (changed.length === 0) { console.log(`⏭️  ${slug} — no changes`); unchanged++; continue }

    console.log(`✏️  ${slug} — ${changed.length} field(s) changed${draft ? ' (updating existing draft)' : ''}`)
    for (const f of changed) console.log(`     ${f}:\n        was: ${short((current as any)[f])}\n        now: ${short((parsed as any)[f])}`)
    if (changed.includes('description') && richDescription)
      console.log('     ⚠️  the live description has formatting (bold/links) that will be lost — plain text will be saved')

    const baseId = base._id.replace(/^drafts\./, '')
    const doc = {...applyChanges(base, parsed, changed), _id: `drafts.${baseId}`}
    if (!DRY_RUN) await sanity.createOrReplace(doc)
    drafted++
  }

  console.log(`\nDone. ${drafted} draft(s) ${DRY_RUN ? 'would be ' : ''}saved, ${unchanged} unchanged, ${failed} failed.`)
  if (drafted > 0 && !DRY_RUN) console.log('Review each in Studio (look for the orange "draft" dot) and click Publish when happy.')
  if (failed > 0) process.exitCode = 1
}

run().catch((err) => { console.error(err); process.exit(1) })
