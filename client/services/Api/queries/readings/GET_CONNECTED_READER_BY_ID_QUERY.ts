import {gql} from '@apollo/client'

export const GET_CONNECTED_READER_BY_ID_QUERY = gql`
  query GetConnectedReaderByIdQuery($reader_id: String = "") {
    connected_readers(where: {reader_id: {_eq: $reader_id}}) {
      session_id
    }
  }
`
