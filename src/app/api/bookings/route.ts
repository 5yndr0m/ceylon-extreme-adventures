// src/app/api/bookings/route.ts
import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@sanity/client'

// Separate client with a write token — never expose this token to the browser,
// this only runs server-side inside the API route
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {experienceId, fullName, email, phone, preferredDate, groupSize, message} = body

  // Minimal server-side validation — don't trust the client form alone
  if (!experienceId || !fullName || !email || !preferredDate) {
    return NextResponse.json({error: 'Missing required fields'}, {status: 400})
  }

  try {
    const booking = await sanity.create({
      _type: 'booking',
      experience: {_type: 'reference', _ref: experienceId},
      fullName,
      email,
      phone,
      preferredDate,
      groupSize,
      message,
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString(),
    })

    // TODO next step: trigger a Resend notification email here (to client + confirmation to customer)
    // once payment isn't wired up yet, this is where the client's team finds out about a new enquiry

    return NextResponse.json({success: true, bookingId: booking._id})
  } catch (err) {
    console.error(err)
    return NextResponse.json({error: 'Failed to create booking'}, {status: 500})
  }
}
