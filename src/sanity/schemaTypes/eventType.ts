// schemaTypes/eventType.ts
import {defineField, defineType} from 'sanity'

// A "event" is a specific scheduled departure of an experience — e.g. the Sep 5
// Dolukanda Hike flyer. This is deliberately separate from `experience` (which is the
// evergreen "read about it, see the gallery, read reviews" page): the client wants
// booking to happen from the events/flyer flow, not the experience page, and a single
// experience (Abseiling Dolukanda) can have many scheduled events across many months.
export const eventType = defineType({
  name: 'event',
  title: 'Event (scheduled departure)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Flyer Title',
      type: 'string',
      description: 'e.g. "Dolukanda Hike" — shown on the flyer, can differ from the experience title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'reference',
      to: [{type: 'experience'}],
      description: 'Powers the "Know about the experience" link — the experience page is where people read about it, see reviews, and browse the gallery',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Departure Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'flyerImage',
      title: 'Flyer / Banner Image',
      type: 'image',
      options: {hotspot: true},
      description: 'The per-event poster (e.g. the "Dolukanda Hike — Sep 05" flyer), not the experience hero image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (LKR)',
      type: 'number',
      description: 'Price for this specific departure — can differ from the experience\'s base price (promos, group rates, etc.)',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'includes',
      title: 'Includes',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: ['Transport', 'Meals', 'Photography', 'Drone Footage'],
        layout: 'grid',
      },
      description: 'Matches the icon row on the flyer template',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      description: 'The blurb shown under the flyer, e.g. "More than adventure — a transformative journey."',
    }),
    defineField({
      name: 'maxParticipants',
      title: 'Max Participants',
      type: 'number',
      description: 'Optional capacity for this departure. Leave blank for no cap.',
      validation: (rule) => rule.positive().integer(),
    }),
    defineField({
      name: 'registrationOpen',
      title: 'Registration Open',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide the booking button once a departure is full or past, without deleting the event',
    }),
  ],
  preview: {
    select: {title: 'title', date: 'date', media: 'flyerImage'},
    prepare({title, date, media}) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}) : undefined,
        media,
      }
    },
  },
})
