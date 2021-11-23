import {gql} from '@apollo/client'

export const REMOVE_LINE_MUTATION = gql`
  mutation RemoveLineMutation($id: Int = 10) {
    delete_prayer_lines(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`
