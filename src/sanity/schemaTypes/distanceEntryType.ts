// schemaTypes/distanceEntryType.ts
//
// "Distance from (km)" reference rows shown on the experience page (e.g. Colombo 175km,
// Ella 43km). Distinct from `coordinates` (used by the trip-planner routing graph, see
// 03_Trip_Routing_Agent.md) — this is just user-facing reference copy pulled straight
// from the CEA Experience Guide, not a routing input.
import {defineField, defineType} from 'sanity'

export const distanceEntryType = defineType({
  name: 'distanceEntry',
  title: 'Distance Entry',
  type: 'object',
  fields: [
    defineField({
      name: 'location',
      title: 'Reference Location',
      type: 'string',
      description: 'e.g. "Colombo", "Kandy", "Ella"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'km',
      title: 'Distance (km)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
  ],
  preview: {
    select: {title: 'location', km: 'km'},
    prepare({title, km}) {
      return {title, subtitle: km ? `${km} km` : undefined}
    },
  },
})
