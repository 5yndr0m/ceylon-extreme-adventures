// schemaTypes/monthlyEventBannerType.ts
import {defineField, defineType} from 'sanity'

// The single designed poster for a given month (e.g. "September Events — In Search Of
// Freedom") shown in the 3-month homepage grid. Deliberately NOT a container that
// references individual `event` docs — which events belong to a month is worked out at
// query time by matching each event's `date` against this document's `month`, so the
// client never has to remember to also link an event here after creating it in Studio.
export const monthlyEventBannerType = defineType({
  name: 'monthlyEventBanner',
  title: 'Monthly Event Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'month',
      title: 'Month',
      type: 'date',
      options: {dateFormat: 'MMMM YYYY'},
      description: 'Pick any date within the target month (e.g. 1 September 2026) — only the month/year is used',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner / Poster Image',
      type: 'image',
      options: {hotspot: true},
      description: 'The full designed poster for the month, e.g. the "September Events" collage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'e.g. "In Search Of Freedom"',
    }),
  ],
  preview: {
    select: {month: 'month', media: 'bannerImage'},
    prepare({month, media}) {
      return {
        title: month ? new Date(month).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'}) : 'Untitled month',
        media,
      }
    },
  },
})
