// factcheck-format.ts
//
// Shared by export-experiences.ts and upload-experiences.ts. Defines the plain-text
// file format used for fact-checking (pasteable into Google Keep, no photos) and the
// conversion both ways between that text and the Sanity `experience` document.
// Keeping it in one place guarantees the two scripts can never disagree on the format.
import crypto from 'crypto'

export const CATEGORIES = [
  'Hiking', 'Rafting', 'Canyoning', 'Abseiling', 'Kayaking',
  'River Expedition', 'Camping & Trekking',
]
export const DIFFICULTIES = ['Easy', 'Moderate', 'Challenging', 'Extreme']
export const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
export const RATINGS = ['best', 'ok', 'worst']

export type Parsed = {
  slug: string
  title: string
  category: string
  difficulty: string
  durationHours?: number
  price?: number
  maxGroupSize?: number
  locationName: string
  shortDescription: string
  activityTags: string[]
  quickFacts: {label: string; value: string}[]
  distancesFrom: {location: string; km: number}[]
  suitableMonths: Record<string, string>
  description: string
}

const SECTIONS = {
  short: 'Short description',
  tags: 'Activity tags',
  facts: 'Quick facts',
  dist: 'Distance from (km)',
  months: 'Suitable months',
  desc: 'Description',
} as const

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const key = () => crypto.randomUUID().replace(/-/g, '').slice(0, 12)
const norm = (s: string) => s.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trim()

// ---------------------------------------------------------------- Portable Text <-> text

type Block = {_type: string; style?: string; listItem?: string; children?: {text?: string; marks?: string[]}[]}

export function blocksToText(blocks: Block[] = []): {text: string; rich: boolean} {
  let rich = false
  const out: string[] = []
  let prevWasList = false
  for (const b of blocks) {
    if (b._type !== 'block') { rich = true; continue }
    if (b.children?.some((c) => (c.marks?.length ?? 0) > 0)) rich = true
    const text = (b.children ?? []).map((c) => c.text ?? '').join('').trim()
    if (!text) continue
    if (b.listItem) {
      if (b.listItem !== 'bullet') rich = true
      out.push((prevWasList ? '' : out.length ? '\n' : '') + `- ${text}`)
      prevWasList = true
      continue
    }
    prevWasList = false
    const heading = /^h[1-6]$/.test(b.style ?? '')
    if (b.style && b.style !== 'normal' && !heading) rich = true // blockquote etc.
    out.push((out.length ? '\n' : '') + (heading ? `### ${text}` : text))
  }
  return {text: out.join('\n').replace(/\n{3,}/g, '\n\n'), rich}
}

export function textToBlocks(text: string) {
  const blocks: any[] = []
  let para: string[] = []
  const span = (t: string) => [{_type: 'span', _key: key(), text: t, marks: []}]
  const flush = () => {
    if (para.length) blocks.push({_type: 'block', _key: key(), style: 'normal', markDefs: [], children: span(para.join(' '))})
    para = []
  }
  for (const raw of norm(text).split('\n')) {
    const line = raw.trim()
    if (!line) { flush(); continue }
    const h = /^###\s+(.*)$/.exec(line)
    const li = /^[-*•]\s+(.*)$/.exec(line)
    if (h) { flush(); blocks.push({_type: 'block', _key: key(), style: 'h4', markDefs: [], children: span(h[1])}) }
    else if (li) { flush(); blocks.push({_type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: span(li[1])}) }
    else para.push(line)
  }
  flush()
  return blocks
}

// ---------------------------------------------------------------- document -> Parsed

export function docToParsed(doc: any): {parsed: Parsed; richDescription: boolean} {
  const {text, rich} = blocksToText(doc.fullDescription)
  const months: Record<string, string> = {}
  for (const k of MONTH_KEYS) if (doc.suitableMonths?.[k]) months[k] = doc.suitableMonths[k]
  return {
    richDescription: rich,
    parsed: {
      slug: doc.slug?.current ?? '',
      title: doc.title ?? '',
      category: doc.category ?? '',
      difficulty: doc.difficulty ?? '',
      durationHours: doc.durationHours ?? undefined,
      price: doc.price ?? undefined,
      maxGroupSize: doc.maxGroupSize ?? undefined,
      locationName: doc.locationName ?? '',
      shortDescription: norm(doc.shortDescription ?? ''),
      activityTags: doc.activityTags ?? [],
      quickFacts: (doc.quickFacts ?? []).map((f: any) => ({label: f.label ?? '', value: f.value ?? ''})),
      distancesFrom: (doc.distancesFrom ?? []).map((d: any) => ({location: d.location ?? '', km: d.km})),
      suitableMonths: months,
      description: text,
    },
  }
}

// ---------------------------------------------------------------- Parsed -> file text

export function renderFile(p: Parsed, richDescription: boolean): string {
  const L: string[] = []
  L.push('// FACT-CHECK FILE. Edit the values and text, but do NOT change the Slug line or the "## " section headings.')
  L.push('// Lines starting with "//" in this top block are ignored. Leave a value blank to clear it.')
  if (richDescription) {
    L.push('// NOTE: the live description has formatting (bold/links/etc) this file cannot hold. If you change the')
    L.push('// Description text it will be re-saved as plain paragraphs, headings and bullets.')
  }
  L.push('')
  L.push(`Slug: ${p.slug}`)
  L.push(`Title: ${p.title}`)
  L.push(`Category: ${p.category}`)
  L.push(`Difficulty: ${p.difficulty}`)
  L.push(`Duration (hours): ${p.durationHours ?? ''}`)
  L.push(`Price (LKR): ${p.price ?? ''}`)
  L.push(`Max group size: ${p.maxGroupSize ?? ''}`)
  L.push(`Location: ${p.locationName}`)
  L.push('')
  L.push(`## ${SECTIONS.short}`); L.push(p.shortDescription); L.push('')
  L.push(`## ${SECTIONS.tags}`); L.push(p.activityTags.join(', ')); L.push('')
  L.push(`## ${SECTIONS.facts}`); for (const f of p.quickFacts) L.push(`- ${f.label}: ${f.value}`); L.push('')
  L.push(`## ${SECTIONS.dist}`); for (const d of p.distancesFrom) L.push(`- ${d.location}: ${d.km}`); L.push('')
  L.push(`## ${SECTIONS.months}`); L.push('// best / ok / worst')
  for (const k of MONTH_KEYS) L.push(`${cap(k)}: ${p.suitableMonths[k] ?? ''}`)
  L.push('')
  L.push(`## ${SECTIONS.desc}`); L.push(p.description); L.push('')
  return L.join('\n')
}

// ---------------------------------------------------------------- file text -> Parsed

export function parseFile(raw: string): {parsed?: Parsed; errors: string[]} {
  const errors: string[] = []
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const names = Object.values(SECTIONS) as string[]
  const sect: Record<string, string[]> = {}
  const head: string[] = []
  let cur: string | null = null
  for (const line of lines) {
    const m = /^##\s+(.+?)\s*$/.exec(line)
    if (m && names.includes(m[1])) { cur = m[1]; sect[cur] = []; continue }
    if (cur) sect[cur].push(line); else head.push(line)
  }
  for (const n of names) if (!sect[n]) errors.push(`Missing section heading "## ${n}"`)

  const field = (label: string): string => {
    const re = new RegExp(`^${label.replace(/[()]/g, '\\$&')}:\\s*(.*)$`, 'i')
    for (const l of head) { const m = re.exec(l); if (m) return m[1].trim() }
    errors.push(`Missing line "${label}:"`)
    return ''
  }
  const num = (label: string): number | undefined => {
    const v = field(label).replace(/,/g, '')
    if (v === '') return undefined
    const n = Number(v)
    if (!Number.isFinite(n)) { errors.push(`"${label}" must be a number, got "${v}"`); return undefined }
    return n
  }

  const slug = field('Slug').split(/\s/)[0]
  const title = field('Title')
  const category = field('Category')
  const difficulty = field('Difficulty')
  if (!title) errors.push('Title cannot be blank')
  if (category && !CATEGORIES.includes(category)) errors.push(`Category "${category}" is not one of: ${CATEGORIES.join(', ')}`)
  if (difficulty && !DIFFICULTIES.includes(difficulty)) errors.push(`Difficulty "${difficulty}" is not one of: ${DIFFICULTIES.join(', ')}`)

  const bullets = (name: string) =>
    (sect[name] ?? []).map((l, i) => ({l: l.trim(), i})).filter(({l}) => l && !l.startsWith('//'))

  const quickFacts: Parsed['quickFacts'] = []
  for (const {l} of bullets(SECTIONS.facts)) {
    const m = /^[-*•]\s*(.+?):\s*(.*)$/.exec(l)
    if (!m) { errors.push(`Quick facts: can't read line "${l}" (expected "- Label: value")`); continue }
    quickFacts.push({label: m[1].trim(), value: m[2].trim()})
  }
  const distancesFrom: Parsed['distancesFrom'] = []
  for (const {l} of bullets(SECTIONS.dist)) {
    const m = /^[-*•]\s*(.+?):\s*([\d.,]+)\s*(?:km)?$/i.exec(l)
    if (!m) { errors.push(`Distance from: can't read line "${l}" (expected "- Place: 123")`); continue }
    distancesFrom.push({location: m[1].trim(), km: Number(m[2].replace(/,/g, ''))})
  }
  const suitableMonths: Record<string, string> = {}
  for (const {l} of bullets(SECTIONS.months)) {
    const m = /^([A-Za-z]{3}):\s*(\w*)$/.exec(l)
    const k = m?.[1].toLowerCase()
    if (!m || !MONTH_KEYS.includes(k!)) { errors.push(`Suitable months: can't read line "${l}"`); continue }
    const v = m[2].toLowerCase()
    if (v && !RATINGS.includes(v)) { errors.push(`Suitable months: ${m[1]} must be best, ok or worst (got "${m[2]}")`); continue }
    if (v) suitableMonths[k!] = v
  }

  const tagsLine = (sect[SECTIONS.tags] ?? []).join(' ').trim()
  const activityTags = tagsLine ? tagsLine.split(',').map((t) => t.trim()).filter(Boolean) : []

  if (errors.length) return {errors}
  return {
    errors,
    parsed: {
      slug, title, category, difficulty,
      durationHours: num('Duration (hours)'),
      price: num('Price (LKR)'),
      maxGroupSize: num('Max group size'),
      locationName: field('Location'),
      shortDescription: norm((sect[SECTIONS.short] ?? []).join('\n')),
      activityTags, quickFacts, distancesFrom, suitableMonths,
      description: norm((sect[SECTIONS.desc] ?? []).join('\n')),
    },
  }
}

// ---------------------------------------------------------------- diff + apply

export function changedFields(oldP: Parsed, newP: Parsed): string[] {
  const keys: (keyof Parsed)[] = ['title', 'category', 'difficulty', 'durationHours', 'price', 'maxGroupSize',
    'locationName', 'shortDescription', 'activityTags', 'quickFacts', 'distancesFrom', 'suitableMonths', 'description']
  return keys.filter((k) => JSON.stringify(oldP[k] ?? '') !== JSON.stringify(newP[k] ?? ''))
}

/** Apply only the changed fields onto a copy of the base doc (everything else, incl. images, is kept). */
export function applyChanges(base: any, newP: Parsed, changed: string[]) {
  const doc = {...base}
  for (const k of ['_rev', '_createdAt', '_updatedAt']) delete doc[k]
  const setOrUnset = (field: string, v: any) => {
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) delete doc[field]
    else doc[field] = v
  }
  for (const f of changed) {
    switch (f) {
      case 'quickFacts':
        setOrUnset(f, newP.quickFacts.map((q) => ({_type: 'quickFact', _key: key(), ...q}))); break
      case 'distancesFrom':
        setOrUnset(f, newP.distancesFrom.map((d) => ({_type: 'distanceEntry', _key: key(), ...d}))); break
      case 'suitableMonths':
        setOrUnset(f, Object.keys(newP.suitableMonths).length ? {_type: 'suitableMonths', ...newP.suitableMonths} : undefined); break
      case 'description':
        setOrUnset('fullDescription', textToBlocks(newP.description)); break
      default:
        setOrUnset(f, (newP as any)[f])
    }
  }
  return doc
}
