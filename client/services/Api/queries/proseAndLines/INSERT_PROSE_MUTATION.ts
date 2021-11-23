import {gql} from '@apollo/client'

export const INSERT_PROSE_MUTATION = gql`
  mutation InsertProseMutation($prayer_slug: String, $tiptap_content: jsonb) {
    insert_prose(
      objects: [{prayer_slug: $prayer_slug, tiptap_content: $tiptap_content}]
      on_conflict: {constraint: prose_pkey, update_columns: [tiptap_content]}
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`
