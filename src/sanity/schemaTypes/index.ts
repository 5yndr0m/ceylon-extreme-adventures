import type {SchemaTypeDefinition} from 'sanity'

import {postType} from './postType'
import {experienceType} from './experienceType'
import {guideType} from './guideType'
import {testimonialType} from './testimonialType'
import {bookingType} from './bookingType'
import {eventType} from './eventType'
import {monthlyEventBannerType} from './monthlyEventBannerType'
import {quickFactType} from './quickFactType'
import {distanceEntryType} from './distanceEntryType'
import {suitableMonthsType} from './suitableMonthsType'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    postType,
    experienceType,
    guideType,
    testimonialType,
    bookingType,
    eventType,
    monthlyEventBannerType,
    // Object types used by experienceType — must be registered here too, Sanity
    // doesn't auto-discover types referenced only by name from other schemas.
    quickFactType,
    distanceEntryType,
    suitableMonthsType,
  ],
}
