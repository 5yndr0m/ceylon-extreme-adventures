// schemaTypes/suitableMonthsType.ts
//
// The month-by-month "Best / Ok / Worst" strip shown on every experience page in the
// CEA Experience Guide. Modelled as 12 fixed fields (rather than a reorderable array)
// since the set of months is fixed and this makes the Studio editing UI a straightforward
// calendar strip instead of an add/remove list.
import {defineField, defineType} from 'sanity'

const MONTHS = [
  ['jan', 'January'],
  ['feb', 'February'],
  ['mar', 'March'],
  ['apr', 'April'],
  ['may', 'May'],
  ['jun', 'June'],
  ['jul', 'July'],
  ['aug', 'August'],
  ['sep', 'September'],
  ['oct', 'October'],
  ['nov', 'November'],
  ['dec', 'December'],
] as const

const RATING_OPTIONS = {
  list: [
    {title: 'Best', value: 'best'},
    {title: 'Ok', value: 'ok'},
    {title: 'Worst', value: 'worst'},
  ],
  layout: 'radio' as const,
}

export const suitableMonthsType = defineType({
  name: 'suitableMonths',
  title: 'Suitable Months',
  type: 'object',
  options: {columns: 3},
  fields: MONTHS.map(([name, title]) =>
    defineField({
      name,
      title,
      type: 'string',
      options: RATING_OPTIONS,
    })
  ),
})
