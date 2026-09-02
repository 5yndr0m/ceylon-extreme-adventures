// src/data/monthlyEvents.ts
//
// STATIC for now. When Sanity is wired up, replace `monthlyEvents` with a
// `getUpcomingMonthlyEvents()` fetch that returns this same shape:
// MonthFlyer[] -> { month, flyerImage, events: EventFlyer[] }
// so MonthlyEventFlyers.tsx below needs zero changes later.

export type EventFlyer = {
  id: string
  title: string
  category: string
  date: string // display string, e.g. "SEP 05"
  price: string // e.g. "13,750 LKR"
  image: string
  description: string
}

export type MonthFlyer = {
  id: string
  month: string // "September"
  year: number
  flyerImage: string // the "cover" flyer shown on the homepage card
  events: EventFlyer[]
}

export const monthlyEvents: MonthFlyer[] = [
  {
    id: 'september-2026',
    month: 'September',
    year: 2026,
    flyerImage:
      'https://images.unsplash.com/photo-1756136720412-b03a99998672?fm=jpg&q=70&w=900&auto=format&fit=crop',
    events: [
      {
        id: 'dolukanda-hike',
        title: 'Dolukanda Hike',
        category: 'Hiking Adventure',
        date: 'SEP 05',
        price: '13,750 LKR',
        image:
          'https://images.unsplash.com/photo-1756136720412-b03a99998672?fm=jpg&q=70&w=900&auto=format&fit=crop',
        description:
          'More than adventure — a transformative journey. Includes transport, meals, photography and drone coverage.',
      },
      {
        id: 'knuckles-5-peaks',
        title: 'Knuckles 5 Peaks Hike',
        category: 'Hiking Adventure',
        date: 'SEP 12',
        price: '15,900 LKR',
        image:
          'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?fm=jpg&q=70&w=900&auto=format&fit=crop',
        description:
          'A demanding multi-peak trek through the Knuckles range, rewarded with some of the best ridgeline views in Sri Lanka.',
      },
      {
        id: 'brandigala-abseiling',
        title: 'Brandigala Abseiling',
        category: 'Abseiling Adventure',
        date: 'SEP 19',
        price: '12,500 LKR',
        image:
          'https://images.unsplash.com/photo-1621693113354-8b32a9e0ba39?fm=jpg&q=70&w=900&auto=format&fit=crop',
        description:
          'Full safety gear and certified guides for a waterfall descent through the Brandigala gorge.',
      },
      {
        id: 'yahangala-hike',
        title: 'Yahangala Hike',
        category: 'Hiking Adventure',
        date: 'SEP 26',
        price: '11,200 LKR',
        image:
          'https://images.unsplash.com/photo-1502680390469-be75c86b636f?fm=jpg&q=70&w=900&auto=format&fit=crop',
        description:
          'A striking table-top rock formation trek with panoramic views over the surrounding lowlands.',
      },
      {
        id: 'raxagala-hike',
        title: 'Raxagala Hike',
        category: 'Hiking Adventure',
        date: 'SEP 27',
        price: '10,800 LKR',
        image:
          'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?fm=jpg&q=70&w=900&auto=format&fit=crop',
        description:
          'A journey of growth, confidence and discovery through ancient rock terrain and forest trails.',
      },
    ],
  },
  {
    id: 'october-2026',
    month: 'October',
    year: 2026,
    flyerImage:
      'https://images.unsplash.com/photo-1641584495089-5914d85d9bcc?fm=jpg&q=70&w=900&auto=format&fit=crop',
    events: [
      {
        id: 'kitulgala-rapids',
        title: 'Kitulgala Rapids Run',
        category: 'Rafting',
        date: 'OCT 03',
        price: '9,800 LKR',
        image:
          'https://images.unsplash.com/photo-1641584495089-5914d85d9bcc?fm=jpg&q=70&w=900&auto=format&fit=crop',
        description: 'Grade II-III rapids on the Kelani River, with lunch and transport included.',
      },
      {
        id: 'ella-canyoning',
        title: 'Ella Gorge Canyoning',
        category: 'Canyoning',
        date: 'OCT 10',
        price: '12,500 LKR',
        image:
          'https://images.unsplash.com/photo-1650911563224-0c843a6d843e?fm=jpg&q=70&w=900&auto=format&fit=crop',
        description: 'Descend through the Ella gorge with safety gear, snacks and drone coverage.',
      },
    ],
    // add more events here — placeholder set for demo purposes
  },
  {
    id: 'november-2026',
    month: 'November',
    year: 2026,
    flyerImage:
      'https://images.unsplash.com/photo-1629248564797-8c5ba85da9d3?fm=jpg&q=70&w=900&auto=format&fit=crop',
    events: [
      {
        id: 'kayaking-calm-waters',
        title: 'Calm Water Kayaking',
        category: 'Kayaking',
        date: 'NOV 07',
        price: '8,500 LKR',
        image:
          'https://images.unsplash.com/photo-1629248564797-8c5ba85da9d3?fm=jpg&q=70&w=900&auto=format&fit=crop',
        description: 'A relaxed, beginner-friendly kayaking trip on calm river stretches.',
      },
    ],
    // add more events here — placeholder set for demo purposes
  },
]