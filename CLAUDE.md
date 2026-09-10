@AGENTS.md

# Ceylon Extreme Adventures — Project Memory Export

This is Claude's accumulated memory for this Claude.ai Project, as of this export. It's derived from past conversations in this Project, not a complete transcript — treat it as a working summary, not a source of truth for anything that needs verifying against the actual codebase or Sanity dataset.

---

## Purpose & Context

Senal (GitHub: `5yndr0m`) is the developer and project lead building a custom website for **Ceylon Extreme Adventures (CEA)**, a Sri Lanka-based adventure tourism company. The project is a full client engagement migrating from an existing WordPress site to a modern stack: **Next.js (App Router) + Sanity CMS + Vercel**, with PayHere for payments and Resend for transactional email. The repo is `5yndr0m/ceylon-extreme-adventures`. A collaborator (friend) contributes frontend work on a separate `Frontend` branch.

Core goals: a fully migrated experience catalog, a working booking/payment flow, and a content-managed site the client can operate via Sanity Studio.

## Current State

The project is substantially built and live at `extremeadventure.lk` (previously `dilanjana.me` during development).

**Content & Sanity:**
- Sanity project ID: `b5qf24u0`, datasets: `production` and `development` (development is not a mirror of production — only has a placeholder doc)
- 24 experiences originally migrated from WordPress; since expanded to 30 based on the CEA Experience Guide PDF (13 Abseiling, 9 Hiking, 2 Camping & Trekking, 3 Canyoning, 3 Rafting/Kayaking), plus 4 older Rafting docs that predate the PDF and don't map cleanly onto it
- Schema additions: `quickFacts` (label/value array), `suitableMonths` (12-field best/ok/worst object), `distancesFrom` (location/km array), `status` field (`active`/`new`/`retired`), `Camping & Trekking` category, gallery image alt text
- All new/updated content currently sits as **drafts in production**, not published — quick facts, suitable months, distances, fact-checked descriptions, and photo galleries/hero images (batch-imported from a large local photo library) are all in, pending review
- 3 real inconsistencies found between the PDF's narrative text and its own Quick Facts table (Kithal Ella, Mannakethi Ella, Nonpareil Falls heights) — resolved by treating Quick Facts as authoritative
- Company Profile Brochure 2026 provided real leadership bios, business registration details (legal name "Ceylon Extreme Adventure (Pvt) Ltd", company number PV 00266067, incorporated 4 Nov 2022), and a Ministry of Tourism recommendation letter — some of this has already been added to the site's About page and FoundersSlider by the Frontend collaborator

**Frontend:**
- `sanity-new` branch merged into `main`; `Frontend` branch also merged in since
- Site link audit performed — found and fixed 4 dead/mismatched links (payment page Refund Policy/Terms links, About page's mismatched "See All Experiences" CTA, homepage "Watch Showreel", homepage gallery grid)
- Still open: two ActivitiesCarousel cards link to categories with zero tagged experiences (River Expedition, Caving); Hiking and "Trekking & Camping" cards resolve to the same filter; the homepage's "Upcoming Adventures" section lost its actual events grid in a recent "simplify Home component" refactor — heading/text remain but no month cards render, even though nav still links there (flagged, not yet resolved whether intentional)

## Outstanding Items (see full tracking file from earlier in this Project for details)

- Rafting mapping decision: 4 old Rafting docs vs. 3 new PDF-sourced ones — deliberately left unmerged pending your call
- Bomburu Ella, Mahaweli Expedition, Pekoe Trail — real photos exist, no experience document yet
- Price (LKR) and coordinates missing on the 9 newly-created draft experiences before they can publish
- Email/title inconsistencies between the Experience Guide and Company Profile brochure (mostly resolved by the Frontend collaborator already)
- Whether the homepage events-grid removal was intentional

## Key Learnings & Principles

- **GROQ date comparisons**: `date` field values must not be lexicographically compared against full ISO datetime strings — caused a silent bug in production
- **Sanity array items**: need both `_type` and `_key` fields or Sanity rejects them
- **Sanity MCP batch limits**: `create_documents` reliably batches ~9 documents at a time
- **Sanity patch behavior**: patching a published document creates a new draft automatically; published content is never touched directly — always review/publish drafts explicitly
- **Slug mismatches**: several experiences have real Sanity slugs that differ from what their titles would suggest (e.g. `diyaluma` not `diyaluma-falls`, `kuvenigala` not `kuwenigala`, `baker-s-bend`, `devil-s-staircase`) — any script matching by slug needs explicit overrides for these
- **Patch delivery workflow**: sandbox has no GitHub push credentials or live Sanity write access by default; code changes are delivered via `git format-patch` / `git am`, verified against the actual current remote branch state before handoff. Sanity content writes ARE possible directly via the connected Sanity MCP tools (query/create/patch documents) when explicitly authorized — this was used directly for the quick-facts, photo, and description backfills rather than requiring Senal to run scripts himself, once he asked for that
- **Migration scripts**: kept in `migration/` — `migrate-quickfacts.ts`, `import-photos.ts` (with `--force` flag to override existing galleries/hero images), `update-descriptions.ts` — all idempotent, matched by slug, never touching fields outside their stated scope

## Working Style

Direct and iterative. Senal runs scripts locally when he chooses to, or has Claude execute directly against Sanity via MCP tools when that's faster and lower-risk (with dry-runs first for anything at scale). Prefers fact-checked, source-verified content over generated filler. Ambiguities (slug mismatches, category conflicts, unclear mappings) get surfaced explicitly rather than silently resolved. Scope corrections happen frequently — stay conservative about assuming scope, confirm before overwriting existing manual work.

---

*This file is a snapshot, not a live sync — memory keeps evolving as the Project continues. If you're using this as a CLAUDE.md for Claude Code, treat the "Current State" section as a starting point to verify against the actual repo and Sanity dataset, not as ground truth.*
