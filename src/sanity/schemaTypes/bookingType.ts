// schemaTypes/bookingType.ts
import {defineField, defineType} from 'sanity'

export const bookingType = defineType({
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    defineField({
      name: 'experience',
      type: 'reference',
      to: [{type: 'experience'}],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'fullName', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'email', type: 'string', validation: (rule) => rule.required().email()}),
    defineField({name: 'phone', type: 'string'}),
    defineField({name: 'preferredDate', type: 'date'}),
    defineField({name: 'groupSize', type: 'number', validation: (rule) => rule.min(1)}),
    defineField({name: 'message', title: 'Message / Notes', type: 'text'}),
    defineField({
      name: 'paymentStatus',
      type: 'string',
      options: {list: ['Pending', 'Paid', 'Failed', 'Refunded']},
      initialValue: 'Pending',
    }),
    defineField({
      name: 'paymentProvider',
      type: 'string',
      options: {list: ['Stripe', 'PayHere']},
    }),
    defineField({name: 'paymentReference', title: 'Payment Reference / Transaction ID', type: 'string'}),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
