// import-photos.ts
//
// Batch-imports the photo library (folders per event, size variants inside each)
// into Sanity: fills each experience's `gallery` array with alt text, and sets
// `heroImage` from the Banners folder where one isn't already set.
//
// This does NOT touch anything else on the document. By default it's idempotent:
// skips gallery upload if the doc already has a non-empty gallery, skips hero upload
// if the doc already has a heroImage — safe to re-run. Pass --force to overwrite both
// regardless of current state (e.g. an experience with a single leftover placeholder
// image in its gallery, or you've re-run photo prep and want the newest set uploaded).
//
// ---- Folder structure this expects ----
// PHOTOS_ROOT/
//   <Event Name>/
//     Full Size(d)/   <image files>
//     Optimized|Optimised/   <same files, compressed>
//     Resized/   <same files, smaller dimensions>
//   Banners/
//     Optimised|Full Sized/
//       <Event-Name>.jpg   (one hero shot per event)
//
// Folder names and nesting are inconsistent in practice (some events are missing
// a size folder, some have Optimized nested inside Resized nested inside Full Size
// by accident) — this script walks recursively rather than assuming fixed depth,
// and dedupes by filename across variants so the same photo is never uploaded twice.
//
// Variant preference when the same filename exists in multiple size folders:
//   Optimized/Optimised  >  Resized  >  Full Size/Full Sized
// (best trade-off between quality and upload time/storage — change PREFERENCE
// below if you'd rather use Full Size for everything.)
//
// ---- Folders with no matching experience — NOT processed, listed at the end ----
// Bomburu Ella, Mahaweli Expedition, Pekoe Trail — real content, no experience
// document exists for these yet in Sanity. Training/City Abseil and Unbranded/*
// are skipped on purpose (internal / extras).
//
// Usage:
//   cd migration
//   npm install
//   PHOTOS_ROOT="/path/to/CEA Photos" npx tsx import-photos.ts --dry-run
//   PHOTOS_ROOT="/path/to/CEA Photos" npx tsx import-photos.ts
//
// Optional: overwrite galleries/hero images that already have something set
// (default is to skip those and leave them alone).
//   PHOTOS_ROOT="/path/to/CEA Photos" npx tsx import-photos.ts --force
//
// Optional: cap how many gallery photos get uploaded per experience (default:
// no cap — everything found in the chosen size folder is uploaded).
//   MAX_GALLERY_PER_EXPERIENCE=12 PHOTOS_ROOT="..." npx tsx import-photos.ts

import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const DRY_RUN = process.argv.includes('--dry-run')
// By default this script never overwrites a gallery/heroImage that's already set (safe to
// re-run without duplicating work). Pass --force to overwrite both regardless of current
// state — useful when an experience has a leftover placeholder image, or you've re-run the
// photo prep and want the freshest set uploaded.
const FORCE = process.argv.includes('--force')
const PHOTOS_ROOT = process.env.PHOTOS_ROOT!
const MAX_GALLERY_PER_EXPERIENCE = process.env.MAX_GALLERY_PER_EXPERIENCE
  ? parseInt(process.env.MAX_GALLERY_PER_EXPERIENCE, 10)
  : Infinity

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])

// Event folder name -> real Sanity slug (confirmed against the live dataset —
// several of these differ from what you'd guess from the folder name alone).
const FOLDER_TO_SLUG: Record<string, string> = {
  Alagalla: 'alagalla',
  "Baker's Bend": 'baker-s-bend',
  Bambarakanda: 'bambarakanda-falls',
  "Devil's Staircase": 'devil-s-staircase',
  Diyaluma: 'diyaluma',
  Dolukanda: 'dolukanda',
  Gartmore: 'gartmore',
  'Gerandi Ella (Beginner)': 'gerandi-ella',
  'Kala Wewa': 'kala-wewa-kayaking',
  Kanawiddagala: 'kanawiddagala',
  'Katarang Oya': 'katarang-oya',
  Katusukonda: 'katusukonda',
  'Kithal Ella': 'kithal-ella',
  'Kodi Ara Kanda': 'kodi-ara-kanda',
  'Kotaganga Ella': 'kotaganga-ella',
  Kurullangala: 'kurullangala',
  'Kuweni Gala': 'kuvenigala', // note: PDF spells this "Kuwenigala", live slug is "kuvenigala"
  Lakegala: 'lakegala',
  Laxapana: 'laxapana',
  Manigala: 'manigala',
  'Mannakethi Ella': 'mannakethi-ella',
  Nonpareil: 'nonpareil-falls',
  'Rikili Ella': 'rikili-ella',
  'Sandun Ella': 'sandun-ella',
  'Sphinx II': 'sphinx-ii-hike',
  'Westminster Abbey': 'govinda-hela', // the guide's own nickname for Govinda Hela
  'Whitewater Rafting': 'whitewater-rafting', // your original doc, not the new PDF one
  Yahangala: 'yahangala',
}

// Folders present in the library with no corresponding experience document yet.
// Reported at the end, never processed.
const KNOWN_UNMATCHED = new Set(['Bomburu Ella', 'Mahaweli Expedition', 'Pekoe Trail'])
const KNOWN_SKIPPED = new Set(['Training', 'Unbranded', 'Banners']) // handled separately or intentionally skipped

const SIZE_FOLDER_PRIORITY = ['optimized', 'optimised', 'resized', 'full size', 'full sized']

function normalizeName(name: string): string {
  return name
    .replace(/\.[^.]+$/, '') // strip extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-\d+$/, '') // strip trailing "-1", "-2" variant suffixes
    .replace(/(^-|-$)/g, '')
}

// Reverse lookup built from FOLDER_TO_SLUG, used to match Banner filenames
// (e.g. "Kotaganga-Ella.jpg" -> normalized "kotaganga-ella" -> same as folder
// "Kotaganga Ella" normalized -> slug "kotaganga-ella").
const NORMALIZED_TO_SLUG: Record<string, string> = {}
for (const [folder, slug] of Object.entries(FOLDER_TO_SLUG)) {
  NORMALIZED_TO_SLUG[normalizeName(folder)] = slug
}

type FoundImage = {filePath: string; priority: number}

/** Recursively collect every image file under `dir`, tagging each with a size-folder priority. */
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
      // sizeFolder = the nearest ancestor directory name relative to dir's parent chain
      const parts = full.split(path.sep)
      const sizeFolder = parts.slice(0, -1).reverse().find((p) => SIZE_FOLDER_PRIORITY.includes(p.toLowerCase())) || ''
      results.push({filePath: full, sizeFolder: sizeFolder.toLowerCase()})
    }
  }
  return results
}

/** For an event folder, pick one file per unique basename, preferring the best size variant. */
function pickBestImages(eventDir: string): string[] {
  const all = walkImages(eventDir)
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
  const buffer = fs.readFileSync(filePath)
  return sanity.assets.upload('image', buffer, {filename: path.basename(filePath)})
}

async function run() {
  if (!PHOTOS_ROOT) {
    console.error('❌ Set PHOTOS_ROOT to the folder containing all the event subfolders.')
    process.exit(1)
  }

  console.log(DRY_RUN ? '--- DRY RUN: no writes will be made ---\n' : '--- LIVE RUN ---\n')

  const topLevel = fs.readdirSync(PHOTOS_ROOT, {withFileTypes: true}).filter((e) => e.isDirectory())
  const unmatchedFound: string[] = []

  // ---- 1. Galleries ----
  for (const entry of topLevel) {
    const folderName = entry.name
    if (KNOWN_SKIPPED.has(folderName)) continue
    if (KNOWN_UNMATCHED.has(folderName)) {
      unmatchedFound.push(folderName)
      continue
    }
    const slug = FOLDER_TO_SLUG[folderName]
    if (!slug) {
      console.warn(`⚠️  Unrecognized folder "${folderName}" — not in FOLDER_TO_SLUG or known-skip lists. Skipping.`)
      continue
    }

    const existing = await sanity.fetch<{_id: string; gallery?: unknown[]} | null>(
      `*[_type == "experience" && slug.current == $slug][0]{_id, gallery}`,
      {slug}
    )
    if (!existing) {
      console.warn(`⚠️  "${folderName}" -> slug "${slug}" but no experience document found. Skipping.`)
      continue
    }
    if (!FORCE && existing.gallery && existing.gallery.length > 0) {
      console.log(
        `⏭️  ${folderName} (${slug}) — gallery already has ${existing.gallery.length} image(s), skipping (use --force to overwrite).`
      )
      continue
    }

    const images = pickBestImages(path.join(PHOTOS_ROOT, folderName)).slice(0, MAX_GALLERY_PER_EXPERIENCE)
    if (images.length === 0) {
      console.log(`(no images found for "${folderName}")`)
      continue
    }

    console.log(`📸 ${folderName} (${slug}) — uploading ${images.length} image(s)`)
    if (!DRY_RUN) {
      const galleryEntries = []
      for (let i = 0; i < images.length; i++) {
        const asset = await uploadImage(images[i])
        galleryEntries.push({
          _type: 'image',
          _key: asset._id.slice(-12),
          asset: {_type: 'reference', _ref: asset._id},
          alt: `${folderName} photo ${i + 1}`,
        })
      }
      await sanity.patch(existing._id).set({gallery: galleryEntries}).commit()
    }
  }

  // ---- 2. Banners -> heroImage ----
  const bannersDir = path.join(PHOTOS_ROOT, 'Banners')
  if (fs.existsSync(bannersDir)) {
    const bannerImages = walkImages(bannersDir)
    // dedupe by basename, preferring Optimised/Optimized over Full Sized
    const byBasename = new Map<string, {filePath: string; priority: number}>()
    for (const {filePath, sizeFolder} of bannerImages) {
      const basename = path.basename(filePath).toLowerCase()
      const priority = SIZE_FOLDER_PRIORITY.indexOf(sizeFolder)
      const effectivePriority = priority === -1 ? SIZE_FOLDER_PRIORITY.length : priority
      const existing = byBasename.get(basename)
      if (!existing || effectivePriority < existing.priority) {
        byBasename.set(basename, {filePath, priority: effectivePriority})
      }
    }

    for (const {filePath} of byBasename.values()) {
      const normalized = normalizeName(path.basename(filePath))
      const slug = NORMALIZED_TO_SLUG[normalized]
      if (!slug) {
        console.log(`(banner "${path.basename(filePath)}" doesn't match a known experience — skipping)`)
        continue
      }
      const existing = await sanity.fetch<{_id: string; heroImage?: unknown} | null>(
        `*[_type == "experience" && slug.current == $slug][0]{_id, heroImage}`,
        {slug}
      )
      if (!existing) continue
      if (!FORCE && existing.heroImage) {
        console.log(`⏭️  banner for "${slug}" — heroImage already set, skipping (use --force to overwrite).`)
        continue
      }
      console.log(`🖼️  ${slug} — setting heroImage from banner`)
      if (!DRY_RUN) {
        const asset = await uploadImage(filePath)
        await sanity
          .patch(existing._id)
          .set({heroImage: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}})
          .commit()
      }
    }
  }

  if (unmatchedFound.length > 0) {
    console.log(`\n⚠️  Folders with no matching experience document (not processed): ${unmatchedFound.join(', ')}`)
  }

  console.log(`\nDone.${DRY_RUN ? ' (dry run — nothing written)' : ''}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
