import {gql} from '@apollo/client'

export const GET_SESSION_BY_USER_ID_QUERY = gql`
  query GetSessionByUserIdQuery($user_id: String = "") {
    readings(where: {created_by_user: {id: {_eq: $user_id}}}) {
      session_id
    }
  }
`
