import {gql} from '@apollo/client'

export const FOLLOW_READING_SUBSCRIPTION = gql`
  subscription FollowReadingSubscription($sessionId: String = "") {
    readings(where: {session_id: {_eq: $sessionId}}) {
      current_url
      current_location_id
      connected_readers_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`
