import {gql} from '@apollo/client'

export const REMOVE_PROSE_MUTATION = gql`
  mutation RemoveProseMutation($id: Int = 10) {
    delete_prose(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`
