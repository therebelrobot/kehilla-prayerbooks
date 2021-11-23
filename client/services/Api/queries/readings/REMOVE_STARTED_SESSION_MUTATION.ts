import {gql} from '@apollo/client'

export const REMOVE_STARTED_SESSION_MUTATION = gql`
  mutation RemoveStartedSessionMutation($sessionId: String = "") {
    delete_readings(where: {session_id: {_eq: $sessionId}}) {
      affected_rows
    }
  }
`
