// copy-unique-images.ts
//
// Walks the WordPress backup's wp-content/uploads folder and copies every unique image
// into a separate, flat destination folder — deduplicated by file content (hash), not just
// filename, since WordPress often has multiple resized copies of the same image
// (e.g. Alagalla.jpg, Alagalla-300x200.jpg, Alagalla-768x512.jpg all being the same photo).
//
// Usage:
//   npx ts-node copy-unique-images.ts --dry-run
//   npx ts-node copy-unique-images.ts
//
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import 'dotenv/config'

const DRY_RUN = process.argv.includes('--dry-run')

const SOURCE_ROOT = process.env.WP_BACKUP_UPLOADS_PATH!
const DEST_ROOT = process.env.UNIQUE_IMAGES_DEST_PATH || path.join(process.cwd(), 'unique-images')

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp'])

// WordPress resize suffix pattern: -300x200, -768x512, -1024x683, -150x150 etc.
// Files matching this are almost always duplicates of a same-named original without the suffix.
const RESIZE_SUFFIX = /-\d+x\d+(?=\.\w+$)/

function isLikelyResizedDuplicate(filename: string): boolean {
  return RESIZE_SUFFIX.test(filename)
}

function hashFile(filePath: string): string {
  const buffer = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath, files)
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath)
    }
  }
  return files
}

function run() {
  if (!SOURCE_ROOT || !fs.existsSync(SOURCE_ROOT)) {
    console.error(`WP_BACKUP_UPLOADS_PATH not set or doesn't exist: ${SOURCE_ROOT}`)
    process.exit(1)
  }

  console.log(`Scanning ${SOURCE_ROOT}...\n`)
  const allFiles = walk(SOURCE_ROOT)
  console.log(`Found ${allFiles.length} total image files.\n`)

  const seenHashes = new Map<string, string>() // hash -> first file path that had it
  const toCopy: string[] = []
  let skippedResized = 0
  let skippedDuplicateContent = 0

  for (const filePath of allFiles) {
    const filename = path.basename(filePath)

    // Skip obvious WordPress-generated resize variants — the un-suffixed original
    // (or largest version) is what we actually want
    if (isLikelyResizedDuplicate(filename)) {
      skippedResized++
      continue
    }

    const hash = hashFile(filePath)
    if (seenHashes.has(hash)) {
      skippedDuplicateContent++
      continue
    }

    seenHashes.set(hash, filePath)
    toCopy.push(filePath)
  }

  console.log(`Unique images to copy: ${toCopy.length}`)
  console.log(`Skipped (resize variants): ${skippedResized}`)
  console.log(`Skipped (identical content, different name): ${skippedDuplicateContent}\n`)

  if (DRY_RUN) {
    toCopy.forEach((f) => console.log(`Would copy: ${f}`))
    console.log('\nDry run complete — nothing copied.')
    return
  }

  fs.mkdirSync(DEST_ROOT, {recursive: true})

  for (const filePath of toCopy) {
    const filename = path.basename(filePath)
    let destPath = path.join(DEST_ROOT, filename)

    // Handle same filename appearing in different subfolders (e.g. two different years'
    // uploads both named "hero.jpg") by appending a short hash suffix rather than overwriting
    if (fs.existsSync(destPath)) {
      const hash = hashFile(filePath).slice(0, 8)
      const ext = path.extname(filename)
      const base = path.basename(filename, ext)
      destPath = path.join(DEST_ROOT, `${base}-${hash}${ext}`)
    }

    fs.copyFileSync(filePath, destPath)
    console.log(`Copied: ${filename}`)
  }

  console.log(`\nDone. ${toCopy.length} unique images copied to ${DEST_ROOT}`)
}

run()
