// migrate-hero-images.ts
import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const DRY_RUN = process.argv.includes('--dry-run')

// Path to the wp-content/uploads folder inside your local WordPress backup.
// Set this in .env as WP_BACKUP_UPLOADS_PATH, e.g.:
// WP_BACKUP_UPLOADS_PATH=/home/syndrom/Documents/ceylone_extream_adventures/wp-backup/wp-content/uploads
const UPLOADS_ROOT = process.env.WP_BACKUP_UPLOADS_PATH!

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

function urlToLocalPath(sourceUrl: string): string {
  // e.g. https://extremeadventure.lk/wp-content/uploads/2020/03/alagalla.jpg
  // ->   2020/03/alagalla.jpg  ->  joined with UPLOADS_ROOT
  const marker = '/wp-content/uploads/'
  const idx = sourceUrl.indexOf(marker)
  const relativePath = idx !== -1 ? sourceUrl.slice(idx + marker.length) : path.basename(sourceUrl)
  return path.join(UPLOADS_ROOT, relativePath)
}

async function run() {
  // Pull every experience that still has the temp source URL field and no real heroImage yet
  const experiences = await sanity.fetch(
    `*[_type == "experience" && defined(heroImageSourceUrl) && !defined(heroImage)]{_id, title, heroImageSourceUrl}`
  )

  console.log(`Found ${experiences.length} experiences needing image upload.\n`)

  for (const exp of experiences) {
    const localPath = urlToLocalPath(exp.heroImageSourceUrl)
    const exists = fs.existsSync(localPath)

    if (DRY_RUN) {
      console.log(`${exists ? '✅ found' : '❌ MISSING'}  ${exp.title}  ->  ${localPath}`)
      continue
    }

    try {
      if (!exists) {
        console.error(`  ❌ File not found in backup: ${localPath} — skipping, fix manually later`)
        continue
      }

      const buffer = fs.readFileSync(localPath)
      const filename = path.basename(localPath)

      const asset = await sanity.assets.upload('image', buffer, {filename})

      await sanity
        .patch(exp._id)
        .set({
          heroImage: {
            _type: 'image',
            asset: {_type: 'reference', _ref: asset._id},
          },
        })
        // Only unset the temp field once the real image is confirmed attached —
        // keeping it around on failure means you can retry without re-diffing what's missing
        .unset(['heroImageSourceUrl'])
        .commit()

      console.log(`  ✅ Uploaded and attached`)
    } catch (err) {
      console.error(`  ❌ Error:`, err)
    }
  }

  console.log(DRY_RUN ? '\nDry run complete — nothing uploaded.' : '\nImage migration complete.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
