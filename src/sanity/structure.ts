import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
// Groups "Monthly Event Banners" and "Events" together at the top since that's the
// client's new recurring monthly task (upload the poster, add that month's events).
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Events')
        .child(
          S.list()
            .title('Events')
            .items([
              S.documentTypeListItem('monthlyEventBanner').title('Monthly Event Banners'),
              S.documentTypeListItem('event').title('Events'),
            ])
        ),
      ...S.documentTypeListItems().filter(
        (item) => !['monthlyEventBanner', 'event'].includes(item.getId() ?? '')
      ),
    ])
