import {gql} from '@apollo/client'

export const REMOVE_CONNECTED_READER_MUTATION = gql`
  mutation RemoveConnectedReaderMutation($reader_id: String = "") {
    delete_connected_readers(where: {reader_id: {_eq: $reader_id}}) {
      affected_rows
    }
  }
`
