// schemaTypes/quickFactType.ts
//
// A single label/value row in an experience's "Quick Facts" table. Deliberately
// free-form (label + value strings) rather than fixed fields, because the facts
// that matter vary a lot by category — e.g. Abseiling Height for abseiling routes,
// Rapids/Rapid Classes for rafting, Kayaking Distance for kayaking, No of Waterfalls
// for multi-drop canyoning routes. See the CEA Experience Guide PDF's per-experience
// "Quick Facts:" tables, which this schema mirrors row-for-row.
import {defineField, defineType} from 'sanity'

export const quickFactType = defineType({
  name: 'quickFact',
  title: 'Quick Fact',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'value'},
  },
})
