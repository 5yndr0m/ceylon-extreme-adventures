// schemaTypes/guideType.ts
import {defineField, defineType} from 'sanity'

export const guideType = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'photo', type: 'image'}),
    defineField({name: 'bio', type: 'text'}),
    defineField({name: 'specialties', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'phone', title: 'Phone / WhatsApp', type: 'string'}),
  ],
})
