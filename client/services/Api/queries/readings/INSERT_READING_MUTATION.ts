import {gql} from '@apollo/client'

export const INSERT_READING_MUTATION = gql`
  mutation InsertReadingMutation(
    $created_by: String = ""
    $session_id: String = ""
    $current_url: String = ""
  ) {
    insert_readings_one(
      object: {session_id: $session_id, current_url: $current_url, created_by: $created_by}
    ) {
      id
    }
  }
`
