// schemaTypes/experienceType.ts
import {defineField, defineType} from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'New (pending review)', value: 'new'},
          {title: 'Retired', value: 'retired'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      description: 'Lifecycle status — use "New" for experiences just added and awaiting a full review (price, photos, description), and "Retired" for ones no longer offered instead of deleting them outright.',
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          'Hiking',
          'Rafting',
          'Canyoning',
          'Abseiling',
          'Kayaking',
          'Caving',
          'River Expedition',
          // Added when backfilling the Camping & Trekking Adventures section from the
          // CEA Experience Guide PDF (Devil's Staircase, Baker's Bend) — these are
          // multi-day trek+camp routes that don't fit any of the categories above.
          'Camping & Trekking',
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      type: 'text',
    }),
    defineField({
      name: 'fullDescription',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'coordinates',
      title: 'Location Coordinates',
      type: 'geopoint',
      description: 'Feeds directly into the trip planner routing graph',
    }),
    defineField({
      name: 'locationName',
      type: 'string',
    }),
    defineField({
      name: 'distancesFrom',
      title: 'Distance From (km)',
      type: 'array',
      of: [{type: 'distanceEntry'}],
      description: 'Reference distances shown on the experience page, e.g. Colombo 175km, Ella 43km — from the "Distance from (km)" box in the CEA Experience Guide. Not used for trip-planner routing (see coordinates for that).',
    }),
    defineField({
      name: 'difficulty',
      type: 'string',
      options: {list: ['Easy', 'Moderate', 'Challenging', 'Extreme']},
    }),
    defineField({
      name: 'durationHours',
      title: 'Duration (hours)',
      type: 'number',
    }),
    defineField({
      name: 'quickFacts',
      title: 'Quick Facts',
      type: 'array',
      of: [{type: 'quickFact'}],
      description: 'The label/value rows from the guide\'s "Quick Facts:" table (Duration, Abseiling Height, Rapids, etc). Order here is display order.',
    }),
    defineField({
      name: 'suitableMonths',
      title: 'Suitable Months',
      type: 'suitableMonths',
      description: 'Month-by-month Best/Ok/Worst rating, as shown on the experience page.',
    }),
    defineField({
      name: 'maxGroupSize',
      title: 'Max Group Size',
      type: 'number',
      description: 'Largest group this experience can safely run for. Leave blank if there is no hard cap.',
      validation: (rule) => rule.positive().integer(),
    }),
    defineField({
      name: 'activityTags',
      title: 'Activity Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Free-form tags (e.g. "beginner-friendly", "night-hike") for search/filtering beyond the main category.',
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'price',
      title: 'Price (LKR)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Accessibility / SEO description of the image.',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'video',
      type: 'file',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'guide',
      title: 'Assigned Guide',
      type: 'reference',
      to: [{type: 'guide'}],
    }),
  ],
})
