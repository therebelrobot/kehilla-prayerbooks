import {gql, useQuery} from '@apollo/client'

const GREETING_LOCATION_QUERY = gql`
  query GreetingLocationQuery {
    greetingLocation {
      name
      geolocation
    }
  }
`

export const useGreetingLocation = () => useQuery(GREETING_LOCATION_QUERY)
