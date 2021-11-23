import {gql} from '@apollo/client'

export const UPDATE_PROSE_MUTATION = gql`
  mutation UpdateProseMutation($id: Int, $tiptap_content: jsonb) {
    update_prose(where: {id: {_eq: $id}}, _set: {tiptap_content: $tiptap_content}) {
      affected_rows
      returning {
        id
      }
    }
  }
`
