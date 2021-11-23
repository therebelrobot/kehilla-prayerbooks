import {gql} from '@apollo/client'

export const INSERT_LINE_MUTATION = gql`
  mutation InsertLineMutation(
    $hebrew: String = ""
    $notes: String = ""
    $prayer_slug: String = ""
    $translation: String = ""
    $transliteration: String = ""
  ) {
    insert_prayer_lines(
      objects: {
        hebrew: $hebrew
        notes: $notes
        prayer_slug: $prayer_slug
        translation: $translation
        transliteration: $transliteration
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`
