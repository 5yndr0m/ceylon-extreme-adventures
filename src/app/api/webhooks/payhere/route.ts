// src/app/api/webhooks/payhere/route.ts
import {NextRequest, NextResponse} from 'next/server'
import crypto from 'crypto'
import {createClient} from '@sanity/client'
import {Resend} from 'resend'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const resend = new Resend(process.env.RESEND_API_KEY!)

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
    // Fetch a bit more than the webhook payload gives us — need the customer's name/email
    // and the experience/event title for the email content, none of which PayHere sends back
    const booking = await sanity.fetch(
      `*[_type == "booking" && _id == $id][0]{
        fullName, email, preferredDate, groupSize,
        experience->{title},
        event->{title}
      }`,
      {id: order_id}
    )

    await sanity
      .patch(order_id)
      .set({
        paymentStatus: 'Paid',
        paymentProvider: 'PayHere',
        paymentReference: data.payment_id,
      })
      .commit()

    if (booking) {
      // An event-based booking is a fixed departure — say so plainly rather than the
      // more open-ended "we'll call to confirm logistics" wording used for a direct
      // experience enquiry with a customer-chosen date.
      const itemTitle = booking.event?.title ?? booking.experience.title
      const dateLabel = new Date(booking.preferredDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

      // Customer-facing confirmation
      const customerResult = await resend.emails.send({
        from: 'Ceylon Extreme Adventures <bookings@test.dilanjana.me>', // swap to the client's real domain once verified in Resend
        to: booking.email,
        subject: `Booking Confirmed — ${itemTitle}`,
        html: booking.event
          ? `
          <p>Hi ${booking.fullName},</p>
          <p>Your spot for <strong>${itemTitle}</strong> on <strong>${dateLabel}</strong> is confirmed.</p>
          <p>Group size: ${booking.groupSize}</p>
          <p>Our team will call you within 24 hours to confirm logistics.</p>
        `
          : `
          <p>Hi ${booking.fullName},</p>
          <p>Your booking for <strong>${itemTitle}</strong> is confirmed.</p>
          <p>Date: ${dateLabel}<br/>Group size: ${booking.groupSize}</p>
          <p>Our team will call you within 24 hours to confirm logistics.</p>
        `,
      })
      // Resend's SDK returns {data, error} rather than throwing on API-level failures
      // (unverified domain, sandbox restrictions, etc.) — log both explicitly or failures go silent
      if (customerResult.error) {
        console.error('❌ Resend failed (customer email):', customerResult.error)
      } else {
        console.log('✅ Customer email sent:', customerResult.data?.id)
      }

      // Internal notification — client's team needs to know a new paid booking came in
      const internalResult = await resend.emails.send({
        from: 'Ceylon Extreme Adventures Site <bookings@test.dilanjana.me>',
        to: process.env.CLIENT_NOTIFICATION_EMAIL!, // set this in env, not hardcoded — client's inbox may change
        subject: `New Paid Booking — ${itemTitle}`,
        html: `
          <p>New booking received:</p>
          <p>${booking.fullName} (${booking.email})<br/>
          ${itemTitle} — ${dateLabel} — ${booking.groupSize} people</p>
          ${booking.event ? '<p>Booked via the events page (fixed departure).</p>' : ''}
          <p>Payment reference: ${data.payment_id}</p>
        `,
      })
      if (internalResult.error) {
        console.error('❌ Resend failed (internal notification):', internalResult.error)
      } else {
        console.log('✅ Internal notification sent:', internalResult.data?.id)
      }
    }

    console.log(`✅ Booking ${order_id} marked Paid via PayHere, emails sent`)
  } else if (status_code === '-2' || status_code === '-1') {
    await sanity.patch(order_id).set({paymentStatus: 'Failed'}).commit()
  }

  return NextResponse.json({received: true})
}
