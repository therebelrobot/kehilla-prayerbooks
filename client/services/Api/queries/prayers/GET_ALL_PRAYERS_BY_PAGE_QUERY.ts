import {gql} from '@apollo/client'

export const GET_ALL_PRAYERS_BY_PAGE_QUERY = gql`
  query GetAllPrayersByPageQuery($bookSlug: String = "", $page: Int = 10) {
    prayers(
      where: {
        section: {prayerbook: {slug: {_eq: $bookSlug}}}
        from_page: {_lte: $page}
        to_page: {_gte: $page}
      }
    ) {
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
