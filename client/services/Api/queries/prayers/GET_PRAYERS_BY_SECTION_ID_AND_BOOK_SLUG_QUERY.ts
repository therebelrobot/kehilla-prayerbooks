import {gql} from '@apollo/client'

export const GET_PRAYERS_BY_SECTION_ID_AND_BOOK_SLUG_QUERY = gql`
  query GetPrayersBySectionIdAndBookSlugQuery($bookSlug: String!, $sectionId: Int!) {
    prayerbooks(where: {slug: {_eq: $bookSlug}}) {
      name
      status
      pdf_link
      id
      slug
      section_order
      sections(where: {id: {_eq: $sectionId}}) {
        id
        slug
        is_supplemental
        name
        prayer_order
        prayers {
          id
          slug
          name
          line_prose_order
          from_page
          to_page
          section_slug
          book_slug
        }
      }
    }
  }
`
