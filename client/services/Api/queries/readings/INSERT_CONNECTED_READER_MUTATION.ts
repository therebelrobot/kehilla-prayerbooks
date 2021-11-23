import {gql} from '@apollo/client'

export const INSERT_CONNECTED_READER_MUTATION = gql`
  mutation InsertConnectedReaderMutation(
    $reader_id: String = ""
    $session_id: String = ""
    $user_id: String = null
  ) {
    insert_connected_readers(
      objects: {reader_id: $reader_id, session_id: $session_id, user_id: $user_id}
      on_conflict: {constraint: connected_readers_pkey, update_columns: [session_id, user_id]}
    ) {
      affected_rows
    }
  }
`
