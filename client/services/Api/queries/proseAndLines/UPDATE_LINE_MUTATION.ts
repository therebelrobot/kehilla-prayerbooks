import {gql} from '@apollo/client'

export const UPDATE_LINE_MUTATION = gql`
  mutation UpdateLineMutation($id: Int = 10, $_set: prayer_lines_set_input = {}) {
    update_prayer_lines(where: {id: {_eq: $id}}, _set: $_set) {
      affected_rows
    }
  }
`
