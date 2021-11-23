import {gql} from '@apollo/client'

export const REMOVE_BOOK_MUTATION = gql`
  mutation RemoveBookMutation($bookId: Int = 0) {
    delete_prayerbooks(where: {id: {_eq: $bookId}}) {
      affected_rows
    }
  }
`
