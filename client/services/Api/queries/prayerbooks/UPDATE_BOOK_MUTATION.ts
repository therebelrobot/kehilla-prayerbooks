import {gql} from '@apollo/client'

export const UPDATE_BOOK_MUTATION = gql`
  mutation UpdateBookMutation($_set: prayerbooks_set_input = {}, $bookId: Int = 0) {
    update_prayerbooks(where: {id: {_eq: $bookId}}, _set: $_set) {
      affected_rows
    }
  }
`
