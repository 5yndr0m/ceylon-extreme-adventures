# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: international tourists planning a trip to Sri Lanka. They find Ceylon Extreme Adventures through search, TripAdvisor or social, want an adrenaline activity (waterfall abseiling, rafting, canyoning, hiking) and need to trust an unfamiliar local operator with their physical safety before paying online.

Secondary: Sri Lankans (weekend adventurers, groups). The site is not built primarily for them, but nothing should be inaccessible to them.

## Product Purpose

The public website and booking system for Ceylon Extreme Adventures (CEA), a Sri Lanka adventure-tourism operator (legal name Ceylon Extreme Adventure (Pvt) Ltd, registered in Sri Lanka in November 2022, based in Nugegoda). It replaced an older WordPress site. A visitor browses the experience catalog, picks a scheduled group departure ("event"), reserves slots and pays online through PayHere, or sends an enquiry for a private trip. Success is a confident, paid booking, or a qualified enquiry to sales@extremeadventure.lk, from someone who has never met the team.

Content is managed by the client in Sanity Studio (project `b5qf24u0`, dataset `production`). Edits sit as drafts until published.

## Positioning

All four of these were confirmed by the owner as true differentiators:
- Safety-first local guides: guides who grew up near the rivers and cliffs they lead, with rescue plans and a hard stop when conditions turn.
- Pioneer credentials: first to abseil Sri Lanka's highest waterfall, Bambarakanda, in 1998 (a founder's credential); SATA Gold winner 2023, 2024 and 2025 (Leading Adventure Sports Operator, South Asia).
- Breadth of routes: 30+ waterfalls, rivers and peaks across abseiling, canyoning, rafting, hiking and trekking.
- Monthly fixed departures: scheduled group events people can join and pay for online, not only private bookings.

## Operating Context

- Catalog: `experience` documents (a place plus an activity) with quick facts, suitable months, distances and galleries. `event` documents are dated departures linked to an experience, carrying the price and registration state. Prices live on events only; experiences deliberately have no price field.
- Booking flow: event page, booking form, `/api/bookings` creates a Pending booking, `/payment` review, PayHere checkout, webhook marks it paid and emails via Resend. Bookings require an event; the experience-only booking path was removed.
- Contact and enquiry forms open the visitor's email client (`mailto:`) addressed to sales@extremeadventure.lk.
- Blog ("Notes From The Trail") is Sanity-driven. Homepage months grid comes from `monthlyEventBanner` documents.
- The working branch is `sanity-new`; `main` is deployed to Vercel at extremeadventure.lk and merged by the owner through PRs.

## Capabilities and Constraints

- Stack in place: Next.js App Router with Turbopack, React 19, Sanity, PayHere, Resend, Vercel. Do not change stack.
- Activity categories are exactly: Abseiling, Hiking, Camping & Trekking, Rafting, Kayaking, Canyoning, River Expedition. There is no Caving and no diving; do not add either to copy or dropdowns.
- The "Rafting & Kayaking" homepage card filters two categories at once (`?category=Rafting,Kayaking`).
- PayHere is still on sandbox settings; the production checkout URL is blocked until the PayHere account is confirmed. Do not present payments as fully live.
- Contact details: sales@extremeadventure.lk, +94 707 900 700 and +94 707 900 701, 93/A Madiwala Rd, Embuldeniya, Nugegoda.
- Most images come from Sanity assets, so sharpness is limited by what was uploaded. Founder portraits are only about 208–286px wide.
- Bomburu Ella, Mahaweli Expedition and Pekoe Trail have photos but no experience document. No Bomburu Ella description, facts or price exists anywhere. GPS coordinates are missing for most experiences.

## Brand Commitments

- Name: Ceylon Extreme Adventures (abbreviated CEA). Taglines in use: "Chase Freedom. One Extreme Adventure at a Time." and "In search of freedom".
- Existing logo files in `public/`: logo-mark, logo-tagline, logo-full. The logo is light-coloured and must stay legible over the hero video.
- The owner chose the testimonials carousel deliberately; keep it as a carousel.
- Voice as written today: direct, guide-to-guest, safety-serious and unpretentious ("we'd rather reschedule than risk it").

## Evidence on Hand

- Verified by the owner and safe to preserve as-is: 500+ adventures led, 98% recommend, 10+ years of experience, 0 injuries on record, 500+ guided down Laxapana, 30+ unique adventures, SATA Gold 2023–2025. Never alter these or invent new numbers.
- 8 real TripAdvisor reviews stored as `testimonial` documents.
- Real photography in `/home/syndrom/Documents/ceylone_extream_adventures/photos` and `New_Images/CEA_Images` (outside the repo), a 28-second hero montage video, and leadership bios and portraits from the 2026 company brochure.
- A recommendation letter from the Ministry of Tourism is referenced in the brochure.
- Absences future work must not fabricate: customer counts beyond those above, other awards, press, and prices for experiences that have no scheduled event.

## Product Principles

1. Earn trust before asking for money: safety, credentials and real faces come ahead of any push to buy.
2. Show the real thing: use CEA's own photography and reviews; never stock imagery or invented proof.
3. Make the next step obvious for someone who has never been to Sri Lanka: what it is, when it runs, how hard it is, what it costs, how to book.
4. Content stays editable: anything the client will change belongs in Sanity, not hard-coded.
5. Claims stay verifiable: do not add numbers, awards or promises the owner has not confirmed.

## Accessibility & Inclusion

- Touch targets meet WCAG 2.5.8 (24px, or spaced equivalent); an earlier Vercel accessibility audit drove this.
- Visible text is part of the accessible name; heading levels increase one at a time; decorative images use empty alt text.
- Respect `prefers-reduced-motion`; the hero falls back to its poster instead of autoplaying video.
- Copy must read clearly for non-native English speakers.
