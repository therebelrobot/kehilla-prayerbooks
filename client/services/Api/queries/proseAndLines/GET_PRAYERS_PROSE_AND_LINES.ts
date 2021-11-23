import {gql} from '@apollo/client'

export const GET_PRAYERS_PROSE_AND_LINES = gql`
  query GetPrayersProseAndLines($bookSlug: String!, $sectionSlug: String!, $prayerSlug: String!) {
    prayerbooks(where: {slug: {_eq: $bookSlug}}) {
      name
      status
      pdf_link
      id
      slug
      sections(where: {slug: {_eq: $sectionSlug}}) {
        id
        slug
        is_supplemental
        name
        prayer_order
        prayers(where: {slug: {_eq: $prayerSlug}}) {
          id
          slug
          name
          line_prose_order
          from_page
          to_page
          prayer_lines {
            id
            hebrew
            notes
            translation
            transliteration
          }
          proses {
            tiptap_content
            prayer_slug
            id
          }
        }
      }
    }
  }
`
