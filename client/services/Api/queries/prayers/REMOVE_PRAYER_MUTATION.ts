import {gql} from '@apollo/client'

export const REMOVE_PRAYER_MUTATION = gql`
  mutation RemovePrayerMutation($prayerId: Int = 10) {
    delete_prayers(where: {id: {_eq: $prayerId}}) {
      affected_rows
    }
  }
`
