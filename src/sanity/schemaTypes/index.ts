import type {SchemaTypeDefinition} from 'sanity'

import {postType} from './postType'
import {experienceType} from './experienceType'
import {guideType} from './guideType'
import {testimonialType} from './testimonialType'
import {bookingType} from './bookingType'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [postType, experienceType, guideType, testimonialType, bookingType],
}
