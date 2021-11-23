import {gql} from '@apollo/client'

export const GET_ALL_PRAYERS_BY_SEARCH_QUERY = gql`
  query GetAllPrayersBySearchQuery($bookSlug: String = "", $query: String = "") {
    prayers(where: {section: {prayerbook: {slug: {_eq: $bookSlug}}}, name: {_ilike: $query}}) {
      id
      name
      slug
      to_page
      from_page
      section {
        prayer_order
        id
        name
        slug
        prayerbook {
          section_order
          name
        }
      }
    }
  }
`
