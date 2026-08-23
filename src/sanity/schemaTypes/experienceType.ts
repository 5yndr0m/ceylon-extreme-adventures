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
      name: 'category',
      type: 'string',
      options: {list: ['Hiking', 'Rafting', 'Canyoning', 'Abseiling', 'Kayaking', 'Caving', 'River Expedition']},
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
      of: [{type: 'image'}],
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
