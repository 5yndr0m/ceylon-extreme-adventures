// migrate-categories.ts
//
// One-off: copies each experience's old single `category` into the new multi-value
// `categories` array, for every experience that doesn't have `categories` yet (published
// docs AND drafts). Nothing else is touched. Safe to re-run — docs that already have
// `categories` are skipped. The old `category` field is left in place (hidden in Studio).
//
// After this, add the extra categories in Studio (tick several boxes) or via the
// fact-check files (`Categories: Abseiling, Hiking`).
//
// Usage:
//   cd migration
//   npx tsx migrate-categories.ts --dry-run
//   npx tsx migrate-categories.ts
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

async function run() {
  console.log(DRY_RUN ? '--- DRY RUN: no writes will be made ---\n' : '--- LIVE RUN ---\n')
  const docs: {_id: string; title: string; category: string}[] = await sanity.fetch(
    `*[_type == "experience" && defined(category) && !(count(categories) > 0)]{_id, title, category}`
  )
  console.log(`Found ${docs.length} document(s) to migrate.\n`)

  for (const d of docs) {
    console.log(`${d._id.startsWith('drafts.') ? '📝 draft    ' : '✅ published'} ${d.title}: category "${d.category}" -> categories ["${d.category}"]`)
    if (!DRY_RUN) await sanity.patch(d._id).set({categories: [d.category]}).commit()
  }
  console.log(`\nDone. ${docs.length} migrated${DRY_RUN ? ' (dry run — nothing written)' : ''}.`)
}

run().catch((err) => { console.error(err); process.exit(1) })
