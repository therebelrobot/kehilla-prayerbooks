import {gql} from '@apollo/client'

export const GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY = gql`
  query GetPrayersBySectionAndBookSlugQuery($bookSlug: String!, $sectionSlug: String!) {
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
        prayers {
          id
          slug
          name
          line_prose_order
          from_page
          to_page
        }
      }
    }
  }
`
