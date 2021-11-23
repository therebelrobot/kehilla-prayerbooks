import {gql} from '@apollo/client'

export const UPDATE_PRAYER_MUTATION = gql`
  mutation UpdatePrayerMutation($_set: prayers_set_input = {}, $prayerId: Int = 10) {
    update_prayers(where: {id: {_eq: $prayerId}}, _set: $_set) {
      affected_rows
    }
  }
`
