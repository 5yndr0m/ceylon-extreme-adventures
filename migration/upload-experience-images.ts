// upload-experience-images.ts
//
// Uploads every image in a folder to one experience's `gallery` in Sanity.
//
// Usage (run from the /migration folder, same .env as the other scripts):
//   npx tsx upload-experience-images.ts <folder> <experience-slug> [options]
//
// Examples:
//   npx tsx upload-experience-images.ts "./photos/Dolukanda" dolukanda --dry-run
//   npx tsx upload-experience-images.ts "./photos/Dolukanda" dolukanda
//   npx tsx upload-experience-images.ts "./photos/Dolukanda" dolukanda --replace
//   npx tsx upload-experience-images.ts "./photos/Dolukanda" dolukanda --hero cover.jpg
//
// Options:
//   --dry-run        List what would happen, write nothing
//   --replace        Replace the existing gallery (default: append to it)
//   --hero [file]    Set heroImage too. With a filename, uses that file from the folder;
//                    without one, uses the first image. Skipped if heroImage is already
//                    set, unless --force-hero is also passed.
//   --force-hero     Overwrite an existing heroImage
//   --recursive      Also pick up images in subfolders
//   --alt "text"     Alt text prefix (default: the experience title) -> "Title photo 1"
//
// Needs in .env: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN (write access)

import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import 'dotenv/config'

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])

// ---- args ----
const argv = process.argv.slice(2)
const flag = (name: string) => argv.includes(name)
const valueOf = (name: string): string | undefined => {
  const i = argv.indexOf(name)
  if (i === -1) return undefined
  const next = argv[i + 1]
  return next && !next.startsWith('--') ? next : undefined
}

// positional args = anything that isn't a flag or a flag's value
const valueFlags = new Set(['--hero', '--alt'])
const positional: string[] = []
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    if (valueFlags.has(argv[i]) && argv[i + 1] && !argv[i + 1].startsWith('--')) i++
    continue
  }
  positional.push(argv[i])
}
const [folderArg, slug] = positional

const DRY_RUN = flag('--dry-run')
const REPLACE = flag('--replace')
const RECURSIVE = flag('--recursive')
const SET_HERO = flag('--hero')
const FORCE_HERO = flag('--force-hero')
const HERO_FILE = valueOf('--hero')
const ALT_PREFIX = valueOf('--alt')

if (!folderArg || !slug) {
  console.error('Usage: npx tsx upload-experience-images.ts <folder> <experience-slug> [--dry-run] [--replace] [--hero [file]] [--recursive] [--alt "text"]')
  process.exit(1)
}

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

function collectImages(dir: string): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (RECURSIVE) out.push(...collectImages(full))
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push(full)
    }
  }
  return out.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
}

const imageRef = (assetId: string) => ({_type: 'image', asset: {_type: 'reference', _ref: assetId}})

async function run() {
  const folder = path.resolve(folderArg)
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    console.error(`❌ Not a folder: ${folder}`)
    process.exit(1)
  }

  const exp = await sanity.fetch<{
    _id: string
    title: string
    gallery?: unknown[]
    heroImage?: unknown
  } | null>(
    `*[_type == "experience" && slug.current == $slug][0]{_id, title, gallery, heroImage}`,
    {slug}
  )
  if (!exp) {
    const all = await sanity.fetch<string[]>(`*[_type == "experience"].slug.current | order(@ asc)`)
    console.error(`❌ No experience with slug "${slug}". Available slugs:\n  ${all.join('\n  ')}`)
    process.exit(1)
  }

  const files = collectImages(folder)
  if (files.length === 0) {
    console.error(`❌ No images (${[...IMAGE_EXT].join(', ')}) found in ${folder}${RECURSIVE ? '' : ' (try --recursive)'}`)
    process.exit(1)
  }

  const existingCount = exp.gallery?.length ?? 0
  console.log(`${DRY_RUN ? '--- DRY RUN ---\n' : ''}Experience: ${exp.title} (${slug})`)
  console.log(`Found ${files.length} image(s) in ${folder}`)
  console.log(
    REPLACE
      ? `Mode: REPLACE gallery (${existingCount} existing image(s) will be removed from the gallery)`
      : `Mode: APPEND to gallery (${existingCount} existing image(s) kept)`
  )

  let heroPath: string | undefined
  if (SET_HERO) {
    heroPath = HERO_FILE
      ? files.find((f) => path.basename(f).toLowerCase() === HERO_FILE.toLowerCase())
      : files[0]
    if (!heroPath) {
      console.error(`❌ --hero file "${HERO_FILE}" not found in folder`)
      process.exit(1)
    }
    if (exp.heroImage && !FORCE_HERO) {
      console.log('Hero: already set, leaving alone (use --force-hero to overwrite)')
      heroPath = undefined
    } else {
      console.log(`Hero: will set from ${path.basename(heroPath)}`)
    }
  }

  if (DRY_RUN) {
    files.forEach((f, i) => console.log(`  ${String(i + 1).padStart(3)}. ${path.relative(folder, f)}`))
    console.log('\nDry run complete — nothing uploaded.')
    return
  }

  const altPrefix = ALT_PREFIX ?? exp.title
  const entries: Record<string, unknown>[] = []
  const assetIdByPath = new Map<string, string>()
  let failed = 0

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    try {
      // Sanity dedupes identical file content on its side, so re-uploading is cheap/safe
      const asset = await sanity.assets.upload('image', fs.createReadStream(file), {
        filename: path.basename(file),
      })
      assetIdByPath.set(file, asset._id)
      entries.push({
        ...imageRef(asset._id),
        _key: crypto.randomBytes(6).toString('hex'),
        alt: `${altPrefix} photo ${existingCount + i + 1}`,
      })
      console.log(`  ✅ ${i + 1}/${files.length}  ${path.basename(file)}`)
    } catch (err) {
      failed++
      console.error(`  ❌ ${i + 1}/${files.length}  ${path.basename(file)} —`, (err as Error).message)
    }
  }

  if (entries.length === 0) {
    console.error('Nothing uploaded successfully, document left untouched.')
    process.exit(1)
  }

  let patch = sanity.patch(exp._id)
  patch = REPLACE ? patch.set({gallery: entries}) : patch.setIfMissing({gallery: []}).append('gallery', entries)

  if (heroPath) {
    // heroPath is one of `files`, so it's already uploaded unless that upload failed
    const heroAssetId = assetIdByPath.get(heroPath)
    if (heroAssetId) patch = patch.set({heroImage: imageRef(heroAssetId)})
    else console.warn('⚠️  Hero image upload failed earlier, heroImage not set.')
  }

  await patch.commit()
  console.log(`\nDone. ${entries.length} image(s) added to "${exp.title}"${failed ? `, ${failed} failed (re-run to retry — already-uploaded files are deduped)` : ''}.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
