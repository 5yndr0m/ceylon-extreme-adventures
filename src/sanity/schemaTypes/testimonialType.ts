import {defineField, defineType} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'customerName', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'quote', type: 'text', validation: (rule) => rule.required()}),
    defineField({
      name: 'rating',
      type: 'number',
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: 'source',
      type: 'string',
      options: {list: ['TripAdvisor', 'Facebook', 'Google', 'Direct']},
    }),
    defineField({name: 'sourceUrl', title: 'Link to Original Review', type: 'url'}),
    defineField({
      name: 'experience',
      title: 'Related Experience',
      type: 'reference',
      to: [{type: 'experience'}],
    }),
    defineField({name: 'photo', type: 'image'}),
    defineField({name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false}),
  ],
})
