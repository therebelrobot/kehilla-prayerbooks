import {gql} from '@apollo/client'

export const INSERT_BOOK_MUTATION = gql`
  mutation InsertBookMutation(
    $name: String = ""
    $pdf_link: String = ""
    $slug: String = ""
    $status: String = ""
  ) {
    insert_prayerbooks(
      objects: [{name: $name, pdf_link: $pdf_link, slug: $slug, status: $status}]
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`
