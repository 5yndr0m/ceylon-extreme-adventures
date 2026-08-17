import { type SchemaTypeDefinition } from 'sanity'
import {experienceType} from './experienceType'
import {guideType} from './guideType'
import {testimonialType} from './testimonialType'
import {bookingType} from './bookingType'
import {postType} from './postType'

export const schemaTypes = [postType, experienceType, guideType, testimonialType, bookingType]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [],
}
