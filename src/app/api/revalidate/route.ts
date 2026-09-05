// src/app/api/revalidate/route.ts
import {NextRequest, NextResponse} from 'next/server'
import {revalidatePath} from 'next/cache'

// Sanity Studio calls this on publish/update/delete (configure under Studio ->
// API -> Webhooks, see the comment at the bottom of this file) so content shows up
// on the live site immediately instead of waiting out the `export const revalidate = 60`
// window on each page. Kept deliberately simple: revalidate the whole site under the
// root layout rather than maintaining a fragile per-content-type path map — with a site
// this size the cost of over-revalidating is negligible next to the cost of silently
// missing a path.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret')
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({error: 'Invalid secret'}, {status: 401})
  }

  let payload: {_type?: string; slug?: string} = {}
  try {
    payload = await req.json()
  } catch {
    // Sanity webhooks can be configured with no body/projection — that's fine,
    // still worth a full revalidation rather than erroring out.
  }

  revalidatePath('/', 'layout')

  console.log(`✅ Revalidated site (triggered by ${payload._type ?? 'unknown'} ${payload.slug ?? ''})`.trim())

  return NextResponse.json({revalidated: true, now: Date.now()})
}

// ---------------------------------------------------------------------------------
// Sanity Studio setup (one-time, in the Sanity manage console, not in this repo):
//   1. https://www.sanity.io/manage -> your project -> API -> Webhooks -> Create webhook
//   2. URL: https://<your-vercel-domain>/api/revalidate
//   3. Dataset: production
//   4. Trigger on: Create, Update, Delete
//   5. HTTP method: POST
//   6. HTTP Headers: x-webhook-secret = <same value as SANITY_REVALIDATE_SECRET in Vercel>
//   7. Projection (optional, just for cleaner logs):
//        {"_type": _type, "slug": slug.current}
// Also add SANITY_REVALIDATE_SECRET to Vercel's environment variables (any random
// string — it's just a shared secret between Sanity and this endpoint).
// ---------------------------------------------------------------------------------
