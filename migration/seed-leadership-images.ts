// seed-leadership-images.ts
//
// One-time script: attaches portraitImage + coverImage to the 3 leadership profile
// documents (Sanjeewa Ariyarathne, Dr. Nath Dharmasena, Manju S. Gunawardana),
// created earlier via the connected Sanity tools with full bio content but no
// images — actual asset uploads need real filesystem + credential access, which
// isn't available from that side, hence this script.
//
// Images are the real photos from the Company Profile Brochure PDF (headshot for
// portraitImage, an action/context photo for coverImage), already cropped and
// converted to WebP.
//
// Usage:
//   cd migration
//   npm install
//   IMAGES_DIR="/path/to/profile-images" npx tsx seed-leadership-images.ts --dry-run
//   IMAGES_DIR="/path/to/profile-images" npx tsx seed-leadership-images.ts

import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const DRY_RUN = process.argv.includes('--dry-run')
const IMAGES_DIR = process.env.IMAGES_DIR!

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// Matches by profile slug -> the two image filenames expected in IMAGES_DIR
const PROFILES: {slug: string; portrait: string; cover: string}[] = [
  {slug: 'nath-dharmasena', portrait: 'nath_portrait.webp', cover: 'nath_cover.webp'},
  {slug: 'manju-gunawardana', portrait: 'manju_portrait.webp', cover: 'manju_cover.webp'},
  {slug: 'sanjeewa-ariyarathne', portrait: 'sanjeewa_portrait.webp', cover: 'sanjeewa_cover.webp'},
]

async function uploadImage(filePath: string) {
  const buffer = fs.readFileSync(filePath)
  return sanity.assets.upload('image', buffer, {filename: path.basename(filePath), contentType: 'image/webp'})
}

async function run() {
  if (!IMAGES_DIR) {
    console.error('Set IMAGES_DIR to the folder containing the 6 profile images.')
    process.exit(1)
  }

  console.log(DRY_RUN ? '--- DRY RUN: no writes will be made ---\n' : '--- LIVE RUN ---\n')

  for (const {slug, portrait, cover} of PROFILES) {
    const existing = await sanity.fetch<{_id: string; name: string} | null>(
      `*[_type == "profile" && slug.current == $slug][0]{_id, name}`,
      {slug}
    )
    if (!existing) {
      console.warn(`No profile found for slug "${slug}" — skipping.`)
      continue
    }

    const portraitPath = path.join(IMAGES_DIR, portrait)
    const coverPath = path.join(IMAGES_DIR, cover)
    if (!fs.existsSync(portraitPath) || !fs.existsSync(coverPath)) {
      console.warn(`Missing image file(s) for "${existing.name}" in ${IMAGES_DIR} — skipping.`)
      continue
    }

    console.log(`${existing.name} — uploading portrait + cover`)
    if (!DRY_RUN) {
      const portraitAsset = await uploadImage(portraitPath)
      const coverAsset = await uploadImage(coverPath)
      await sanity
        .patch(existing._id)
        .set({
          portraitImage: {_type: 'image', asset: {_type: 'reference', _ref: portraitAsset._id}},
          coverImage: {_type: 'image', asset: {_type: 'reference', _ref: coverAsset._id}},
        })
        .commit()
    }
  }

  console.log(`\nDone.${DRY_RUN ? ' (dry run — nothing written)' : ''}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
