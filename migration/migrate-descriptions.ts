// migrate-descriptions.ts
//
// Elementor stores each page's content as a big nested JSON tree in a single postmeta row
// (_elementor_data), not as plain post_content. There's no clean "description" field to read —
// the text is scattered across text-editor / heading widgets nested inside sections/columns at
// arbitrary depth. This script walks that tree, pulls out anything text-shaped, and converts it
// into Sanity Portable Text blocks for the experience's `fullDescription` field.
//
// Usage:
//   npx ts-node migrate-descriptions.ts --dry-run
//   npx ts-node migrate-descriptions.ts
//   npx ts-node migrate-descriptions.ts --force   (overwrite experiences that already have fullDescription)
//
import mysql from 'mysql2/promise'
import {createClient} from '@sanity/client'
import 'dotenv/config'

const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force') // re-run and overwrite even if fullDescription is already set

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// Same 24 real experience post IDs used in migrate-experiences.ts
const EXPERIENCE_IDS = [
  5732, 5776, 5819, 5942, 5970, 6028, 6061, 6102, 6125, 6142, 6167, 6194,
  6218, 6242, 6259, 6280, 6307, 6329, 6352, 6389, 6420, 6447, 6467, 7540,
]

// ---- HTML -> plain paragraph text -------------------------------------------------
// Elementor's "text-editor" widget stores rich HTML in settings.editor (WordPress's
// own TinyMCE output — <p>, <strong>, <em>, <ul>/<li>, <br>, etc). We don't need to
// preserve formatting for a first pass, just get real paragraphs into the CMS instead
// of nothing — the client can re-format in the Studio's block editor once it's in.
function decodeEntities(str: string): string {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201d')
    .replace(/&ldquo;/g, '\u201c')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
}

function htmlToParagraphs(html: string): string[] {
  if (!html) return []
  const withBreaksAsNewlines = html.replace(/<br\s*\/?>/gi, '\n')
  // Split on block-level closing tags so list items and paragraphs each become their own block
  const chunks = withBreaksAsNewlines
    .split(/<\/(p|li|h[1-6])>/i)
    .map((chunk) => chunk.replace(/<[^>]+>/g, '')) // strip remaining tags (opening tags, spans, etc.)
    .map((chunk) => decodeEntities(chunk).replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  return chunks
}

function paragraphsToBlocks(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', text, marks: []}],
  }))
}

// ---- Elementor tree walker ----------------------------------------------------------
// elType is 'section' | 'column' | 'widget' | 'container' (newer Elementor) — only
// 'widget' nodes carry real content, everything else is just layout and needs recursing into.
function extractTextFromElementorTree(nodes: any[], out: string[]) {
  for (const node of nodes ?? []) {
    if (!node || typeof node !== 'object') continue

    if (node.elType === 'widget') {
      const settings = node.settings ?? {}
      switch (node.widgetType) {
        case 'text-editor':
          out.push(...htmlToParagraphs(settings.editor ?? ''))
          break
        case 'heading':
          if (settings.title) out.push(decodeEntities(String(settings.title)).trim())
          break
        // Some Elementor exports use a generic 'theme-post-content' or 'shortcode' widget,
        // or nest text in settings.text / settings.content — catch those too rather than
        // silently dropping them
        default:
          if (typeof settings.editor === 'string') out.push(...htmlToParagraphs(settings.editor))
          if (typeof settings.text === 'string' && settings.text.trim()) out.push(decodeEntities(settings.text).trim())
          if (typeof settings.content === 'string' && settings.content.trim()) out.push(...htmlToParagraphs(settings.content))
      }
    }

    // Recurse into children regardless of node type — sections/columns/containers nest further
    if (Array.isArray(node.elements) && node.elements.length > 0) {
      extractTextFromElementorTree(node.elements, out)
    }
  }
}

function parseElementorData(raw: string): string[] {
  let tree: any
  try {
    tree = JSON.parse(raw)
  } catch {
    // Elementor sometimes double-encodes or the export escaped quotes oddly — one retry
    // with unescaping before giving up on this post
    try {
      tree = JSON.parse(raw.replace(/\\"/g, '"'))
    } catch {
      return []
    }
  }
  const out: string[] = []
  extractTextFromElementorTree(Array.isArray(tree) ? tree : [tree], out)
  // De-dupe consecutive identical paragraphs — Elementor templates sometimes repeat a
  // heading in both a hidden mobile and desktop variant of the same section
  return out.filter((p, i) => p !== out[i - 1])
}

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })

  const [posts] = await conn.query<any[]>(
    `SELECT ID, post_title FROM wp_posts WHERE ID IN (${EXPERIENCE_IDS.join(',')})`
  )

  let migrated = 0
  let skippedExisting = 0
  let skippedEmpty = 0

  for (const post of posts) {
    const [rows] = await conn.query<any[]>(
      `SELECT meta_value FROM wp_postmeta WHERE post_id = ? AND meta_key = '_elementor_data'`,
      [post.ID]
    )
    const raw = rows[0]?.meta_value

    if (!raw) {
      console.log(`⚠️  ${post.post_title} (wp_id ${post.ID}): no _elementor_data found — page may not use Elementor, skipping`)
      skippedEmpty++
      continue
    }

    const paragraphs = parseElementorData(raw)
    if (paragraphs.length === 0) {
      console.log(`⚠️  ${post.post_title} (wp_id ${post.ID}): _elementor_data present but no extractable text — skipping`)
      skippedEmpty++
      continue
    }

    const docId = `experience-${post.ID}` // matches the deterministic id from migrate-experiences.ts

    if (!FORCE) {
      const existing = await sanity.fetch(`*[_id == $id][0]{fullDescription}`, {id: docId})
      if (existing?.fullDescription && existing.fullDescription.length > 0) {
        console.log(`⏭️  ${post.post_title}: fullDescription already set, skipping (use --force to overwrite)`)
        skippedExisting++
        continue
      }
    }

    const blocks = paragraphsToBlocks(paragraphs)

    if (DRY_RUN) {
      console.log(`\n=== ${post.post_title} (wp_id ${post.ID}) — ${paragraphs.length} paragraph(s) ===`)
      paragraphs.forEach((p) => console.log(`  ${p.slice(0, 100)}${p.length > 100 ? '…' : ''}`))
      continue
    }

    await sanity.patch(docId).set({fullDescription: blocks}).commit()
    console.log(`✅ ${post.post_title}: wrote ${blocks.length} block(s)`)
    migrated++
  }

  await conn.end()

  if (!DRY_RUN) {
    console.log(`\nDone. ${migrated} migrated, ${skippedExisting} already had descriptions, ${skippedEmpty} had no extractable content.`)
    if (skippedEmpty > 0) {
      console.log('Posts with no extractable content need a manual description written in Studio.')
    }
  } else {
    console.log('\nDry run complete — no data written.')
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
