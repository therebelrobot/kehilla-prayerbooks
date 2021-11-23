import {gql} from '@apollo/client'

export const GET_SECTIONS_BY_BOOK_SLUG_QUERY = gql`
  query GetSectionsByBookSlugQuery($bookSlug: String!) {
    prayerbooks(where: {slug: {_eq: $bookSlug}}) {
      name
      status
      pdf_link
      id
      slug
      section_order
      sections {
        id
        is_supplemental
        name
        prayer_order
        slug
        prayers_aggregate {
          aggregate {
            min {
              from_page
            }
            max {
              to_page
            }
          }
        }
      }
    }
  }
`
