// schemaTypes/profileType.ts
//
// Replaces guideType.ts. Originally just a lightweight "who's leading this trip"
// reference for experiences (name/photo/bio/phone) — expanded into a fuller person
// profile so it can also represent CEA's leadership (Sanjeewa Ariyarathne, Dr. Nath
// Dharmasena, Manju S. Gunawardana), who need a portrait, a cover image, and a real
// long-form bio rather than the one-line summary a tour guide reference needed.
//
// Still used exactly the same way for experience.guide references — the extra fields
// (coverImage, longDescription, role, email, slug) are simply optional, so a lightweight
// guide profile with just a name/portrait/short bio/phone is still perfectly valid.
import {defineField, defineType} from 'sanity'

export const profileType = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      description: 'For a future individual profile page (e.g. /about/team/sanjeewa-ariyarathne). Not required for a profile to just be referenced as an experience guide.',
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g. "Chairman", "Managing Director & CEO", "Director / Technical Advisor" — or a tour guide\'s role if this profile is just used as an experience guide.',
    }),
    defineField({
      name: 'portraitImage',
      title: 'Portrait Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Headshot / portrait — used for guide cards and team listings.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Wide banner-style image for an individual profile page. Not needed for a plain experience-guide reference.',
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      description: 'One or two sentences — used in compact contexts like the experience page\'s "Your guide" card.',
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Full biography, for an individual profile page. Not needed for a plain experience-guide reference.',
    }),
    defineField({
      name: 'specialties',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone / WhatsApp',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'portraitImage'},
  },
})
