import {gql} from '@apollo/client'

export const UPDATE_STARTED_SESSION_MUTATION = gql`
  mutation UpdateStartedSessionMutation($sessionId: String = "", $_set: readings_set_input = {}) {
    update_readings(where: {session_id: {_eq: $sessionId}}, _set: $_set) {
      affected_rows
    }
  }
`
