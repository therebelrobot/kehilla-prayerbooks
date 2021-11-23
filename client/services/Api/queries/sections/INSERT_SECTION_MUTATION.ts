import {gql} from '@apollo/client'

export const INSERT_SECTION_MUTATION = gql`
  mutation InsertBookMutation($name: String = "", $slug: String = "", $book_slug: String = "") {
    insert_sections(objects: [{name: $name, slug: $slug, book_slug: $book_slug}]) {
      affected_rows
      returning {
        id
      }
    }
  }
`
