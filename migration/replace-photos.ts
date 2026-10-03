// replace-photos.ts
//
// One-off: replace each experience's gallery (and clear heroImage) with the
// current photo library at PHOTOS_ROOT. Unlike import-photos.ts (which skips
// anything already populated, and sets heroImage from a Banners folder), this
// ALWAYS overwrites the gallery for every matched experience, and only UNSETS
// heroImage — it never sets a new one, since the client/owner is choosing hero
// images manually in Studio afterward.
//
// Every image is resized to a 2400px-wide cap (large originals here run
// 15-45MB straight off a drone/DSLR; nothing on the site ever displays
// anywhere near that) and converted to WebP before upload, same as
// import-photos.ts.
//
// Folders with no matching experience document are reported and skipped.
// Experiences with no matching folder here are left completely untouched
// (their existing gallery/hero, if any, is not touched) -- e.g. Alagalla,
// which isn't part of this photo drop.
//
// Special case: "Rafting" and "Whitewater Rafting" are the same shoot (same
// filenames; "Whitewater Rafting" is just the Optimized/compressed variant),
// generic Kithulgala whitewater shots not tied to a specific level. Per the
// owner's call, that one combined set is applied to all three rafting-level
// experiences (Beginner/Extreme/Full Day Rafting & Canyoning).
//
// Usage:
//   cd migration
//   PHOTOS_ROOT="/home/syndrom/Documents/ceylone_extream_adventures/photos" npx tsx replace-photos.ts --dry-run
//   PHOTOS_ROOT="/home/syndrom/Documents/ceylone_extream_adventures/photos" npx tsx replace-photos.ts

import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import 'dotenv/config'

const DRY_RUN = process.argv.includes('--dry-run')
const PHOTOS_ROOT = process.env.PHOTOS_ROOT!
const MAX_WIDTH = process.env.MAX_WIDTH ? parseInt(process.env.MAX_WIDTH, 10) : 2400
const WEBP_QUALITY = process.env.WEBP_QUALITY ? parseInt(process.env.WEBP_QUALITY, 10) : 82

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const SIZE_FOLDER_PRIORITY = ['optimized', 'optimised', 'resized', 'full size', 'full sized']

// Current on-disk folder name -> real Sanity slug (folder names have drifted since
// the earlier import-photos.ts mapping was written -- re-verified against the live
// dataset before writing this).
const FOLDER_TO_SLUG: Record<string, string[]> = {
  bakersbend: ['baker-s-bend'],
  bambarakanda: ['bambarakanda-falls'],
  devils: ['devil-s-staircase'],
  diyaluma: ['diyaluma'],
  dolukanda: ['dolukanda'],
  gartmore: ['gartmore'],
  'geradi ella': ['gerandi-ella'],
  'kala wewa': ['kala-wewa-kayaking'],
  Kanawiddagala: ['kanawiddagala'],
  'Katarang Oya': ['katarang-oya'],
  Katusukonda: ['katusukonda'],
  'Kithal Ella': ['kithal-ella'],
  'Kodi Ara Kanda': ['kodi-ara-kanda'],
  'Kotaganga Ella': ['kotaganga-ella'],
  Kurullangala: ['kurullangala'],
  'Kuweni Gala': ['kuvenigala'],
  Lakegala: ['lakegala'],
  Laxapana: ['laxapana'],
  Manigala: ['manigala'],
  'Mannakethi Ella': ['mannakethi-ella'],
  'Rikili Ella': ['rikili-ella'],
  'Sandun Ella': ['sandun-ella'],
  'Sphinx II': ['sphinx-ii-hike'],
  'Westminster Abbey': ['govinda-hela'],
  Yahangala: ['yahangala'],
  // Generic Kithulgala rafting shots, applied to all three level experiences per
  // the owner's decision -- see header comment. "Whitewater Rafting" (the
  // Optimized variant of the same shoot) is merged in below, not listed as its
  // own entry.
  Rafting: ['beginner-rafting-canyoning', 'extreme-rafting-canyoning', 'full-day-rafting'],
}
// Folders whose images get merged into another folder's set rather than treated
// as their own experience.
const MERGE_INTO: Record<string, string> = {
  'Whitewater Rafting': 'Rafting',
}

// Folders present with no experience document yet -- reported, never processed.
const KNOWN_UNMATCHED = new Set(['bomburuella', 'Mahaweli Expedition'])

function walkImages(dir: string): {filePath: string; sizeFolder: string}[] {
  const results: {filePath: string; sizeFolder: string}[] = []
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, {withFileTypes: true})
  } catch {
    return results
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkImages(full))
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      const parts = full.split(path.sep)
      const sizeFolder = parts.slice(0, -1).reverse().find((p) => SIZE_FOLDER_PRIORITY.includes(p.toLowerCase())) || ''
      results.push({filePath: full, sizeFolder: sizeFolder.toLowerCase()})
    }
  }
  return results
}

/** Pick one file per unique basename (case-insensitive) across one or more source dirs,
 * preferring the best size variant when the same photo appears in more than one. */
function pickBestImages(dirs: string[]): string[] {
  const all = dirs.flatMap((d) => walkImages(d))
  const byBasename = new Map<string, {filePath: string; priority: number}>()
  for (const {filePath, sizeFolder} of all) {
    const basename = path.basename(filePath).toLowerCase()
    const priority = SIZE_FOLDER_PRIORITY.indexOf(sizeFolder)
    const effectivePriority = priority === -1 ? SIZE_FOLDER_PRIORITY.length : priority
    const existing = byBasename.get(basename)
    if (!existing || effectivePriority < existing.priority) {
      byBasename.set(basename, {filePath, priority: effectivePriority})
    }
  }
  return [...byBasename.values()].sort((a, b) => a.filePath.localeCompare(b.filePath)).map((v) => v.filePath)
}

async function uploadImage(filePath: string) {
  const original = fs.readFileSync(filePath)
  const webpBuffer = await sharp(original)
    .resize({width: MAX_WIDTH, withoutEnlargement: true})
    .webp({quality: WEBP_QUALITY})
    .toBuffer()
  const filename = path.basename(filePath, path.extname(filePath)) + '.webp'
  return sanity.assets.upload('image', webpBuffer, {filename, contentType: 'image/webp'})
}

async function run() {
  if (!PHOTOS_ROOT) {
    console.error('❌ Set PHOTOS_ROOT to the folder containing all the event subfolders.')
    process.exit(1)
  }
  console.log(DRY_RUN ? '--- DRY RUN: no writes will be made ---\n' : '--- LIVE RUN ---\n')

  const topLevel = fs.readdirSync(PHOTOS_ROOT, {withFileTypes: true}).filter((e) => e.isDirectory()).map((e) => e.name)
  const unmatchedFound: string[] = []
  const noExperienceFound: string[] = []

  // Build the source-dir list per top-level folder, folding merged folders in.
  const dirsForFolder = new Map<string, string[]>()
  for (const folder of topLevel) {
    if (MERGE_INTO[folder]) continue // handled via its target below
    const dirs = [path.join(PHOTOS_ROOT, folder)]
    for (const [mergeFolder, target] of Object.entries(MERGE_INTO)) {
      if (target === folder && topLevel.includes(mergeFolder)) {
        dirs.push(path.join(PHOTOS_ROOT, mergeFolder))
      }
    }
    dirsForFolder.set(folder, dirs)
  }

  for (const folder of topLevel) {
    if (MERGE_INTO[folder]) continue
    const slugs = FOLDER_TO_SLUG[folder]
    if (!slugs) {
      if (KNOWN_UNMATCHED.has(folder)) {
        unmatchedFound.push(folder)
      } else {
        console.warn(`⚠️  Unrecognized folder "${folder}" -- not in FOLDER_TO_SLUG or known-unmatched list. Skipping.`)
      }
      continue
    }

    const images = pickBestImages(dirsForFolder.get(folder)!)
    if (images.length === 0) {
      console.log(`(no images found for "${folder}")`)
      continue
    }

    // Upload once, reuse the same asset refs across every slug this folder maps to.
    console.log(`📸 ${folder} -> [${slugs.join(', ')}] -- uploading ${images.length} image(s)`)
    let galleryEntries: any[] = []
    if (!DRY_RUN) {
      for (let i = 0; i < images.length; i++) {
        const asset = await uploadImage(images[i])
        galleryEntries.push({
          _type: 'image',
          _key: `${asset._id.slice(-12)}${i}`,
          asset: {_type: 'reference', _ref: asset._id},
          alt: `${folder} photo ${i + 1}`,
        })
      }
    }

    for (const slug of slugs) {
      const existing = await sanity.fetch<{_id: string} | null>(
        `*[_type == "experience" && slug.current == $slug][0]{_id}`,
        {slug}
      )
      if (!existing) {
        noExperienceFound.push(`${folder} -> ${slug}`)
        continue
      }
      console.log(`  -> ${slug}: clearing gallery+heroImage, setting ${galleryEntries.length} new gallery image(s)`)
      if (!DRY_RUN) {
        await sanity
          .patch(existing._id)
          .unset(['gallery', 'heroImage'])
          .commit()
        await sanity.patch(existing._id).set({gallery: galleryEntries}).commit()
      }
    }
  }

  if (unmatchedFound.length > 0) {
    console.log(`\n⚠️  Folders with no experience document yet (not processed): ${unmatchedFound.join(', ')}`)
  }
  if (noExperienceFound.length > 0) {
    console.log(`\n⚠️  Mapped slugs that don't exist in Sanity: ${noExperienceFound.join(', ')}`)
  }
  console.log(`\nDone.${DRY_RUN ? ' (dry run -- nothing written)' : ''}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
