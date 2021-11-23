import {gql} from '@apollo/client'

export const INSERT_PRAYER_MUTATION = gql`
  mutation InsertBookMutation(
    $name: String = ""
    $slug: String = ""
    $section_slug: String = ""
    $book_slug: String = ""
  ) {
    insert_prayers(
      objects: [{name: $name, slug: $slug, section_slug: $section_slug, book_slug: $book_slug}]
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`
