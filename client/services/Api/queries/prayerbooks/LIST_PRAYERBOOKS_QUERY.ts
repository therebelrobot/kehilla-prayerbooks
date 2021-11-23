import {gql} from '@apollo/client'

export const LIST_PRAYERBOOKS_QUERY = gql`
  query ListPrayerbooksQuery {
    prayerbooks {
      name
      status
      pdf_link
      id
      slug
    }
  }
`
