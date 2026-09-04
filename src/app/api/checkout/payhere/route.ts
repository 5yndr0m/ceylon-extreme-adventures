// src/app/api/checkout/payhere/route.ts
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

// PayHere doesn't use an SDK-driven session like Stripe — instead the browser submits
// a plain HTML form directly to PayHere's checkout URL, with a hash proving the amount
// wasn't tampered with client-side. This route's job is just to compute that hash server-side
// and hand back everything the frontend form needs to submit.
export async function POST(req: NextRequest) {
  const {bookingId} = await req.json()

  const booking = await sanity.fetch(
    `*[_type == "booking" && _id == $id][0]{
      _id, fullName, email, phone, groupSize,
      experience->{title, price},
      event->{title, price}
    }`,
    {id: bookingId}
  )

  if (!booking) {
    return NextResponse.json({error: 'Booking not found'}, {status: 404})
  }

  // An event-based booking uses the event's own price/title (can differ from the
  // experience's base rate — promos, group rates, etc.) rather than the experience's.
  const item = booking.event ?? booking.experience
  const amount = (item.price * (booking.groupSize || 1)).toFixed(2)
  const merchantId = process.env.PAYHERE_MERCHANT_ID!
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET!
  const currency = 'LKR'
  const orderId = booking._id

  // PayHere's required hash formula: MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret))
  // uppercased at each step — this exact format is mandated by their docs, deviating breaks verification
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()
  const hash = crypto
    .createHash('md5')
    .update(merchantId + orderId + amount + currency + hashedSecret)
    .digest('hex')
    .toUpperCase()

  const [firstName, ...rest] = (booking.fullName || 'Guest').split(' ')

  return NextResponse.json({
    // Sandbox URL while testing — switch to https://www.payhere.lk/pay/checkout for production
    checkoutUrl: 'https://sandbox.payhere.lk/pay/checkout',
    fields: {
      merchant_id: merchantId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking-confirmed?booking_id=${booking._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/experiences`,
      notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/payhere`,
      order_id: orderId,
      items: item.title,
      currency,
      amount,
      first_name: firstName,
      last_name: rest.join(' ') || '-',
      email: booking.email,
      phone: booking.phone || '0700000000',
      address: '-',
      city: '-',
      country: 'Sri Lanka',
      hash,
    },
  })
}
