import {gql} from '@apollo/client'

export const UPDATE_BOOK_MUTATION_BY_SLUG = gql`
  mutation UpdateBookMutation($_set: prayerbooks_set_input = {}, $bookSlug: String = "") {
    update_prayerbooks(where: {slug: {_eq: $bookSlug}}, _set: $_set) {
      affected_rows
    }
  }
`
