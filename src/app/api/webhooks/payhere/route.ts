// src/app/api/webhooks/payhere/route.ts
import {NextRequest, NextResponse} from 'next/server'
import crypto from 'crypto'
import {createClient} from '@sanity/client'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

// PayHere calls this as a server-to-server POST (notify_url) after payment —
// this is the source of truth, NOT the browser redirect to return_url, which
// can be interrupted if the customer closes the tab. Same reasoning as the Stripe webhook.
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const data = Object.fromEntries(formData.entries()) as Record<string, string>

  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = data

  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET!
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()

  // Recompute the expected signature and compare — this is how you know the notification
  // genuinely came from PayHere and wasn't spoofed by someone POSTing to this endpoint directly
  const expectedSig = crypto
    .createHash('md5')
    .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret)
    .digest('hex')
    .toUpperCase()

  if (md5sig !== expectedSig) {
    console.error('PayHere webhook signature mismatch — possible spoofed request')
    return NextResponse.json({error: 'Invalid signature'}, {status: 400})
  }

  // status_code 2 = success. Other codes: 0 pending, -1 canceled, -2 failed, -3 chargedback
  if (status_code === '2') {
    await sanity
      .patch(order_id)
      .set({
        paymentStatus: 'Paid',
        paymentProvider: 'PayHere',
        paymentReference: data.payment_id,
      })
      .commit()

    // TODO: trigger Resend confirmation email here once Resend is wired up
    console.log(`✅ Booking ${order_id} marked Paid via PayHere`)
  } else if (status_code === '-2' || status_code === '-1') {
    await sanity.patch(order_id).set({paymentStatus: 'Failed'}).commit()
  }

  return NextResponse.json({received: true})
}
