import React from 'react'

import {gql, useQuery} from '@apollo/client'

import {useReload} from '_/services/state'
import {localStorage} from '_/utils/localStorage'

const GREETING_LOCATION_QUERY = gql`
  query GreetingLocationQuery {
    greetingLocation {
      name
      geolocation
    }
  }
`

export const useGreetingLocation = () => useQuery(GREETING_LOCATION_QUERY)

const LIST_PRAYERBOOKS_QUERY = gql`
  query MyQuery {
    prayerbooks {
      name
      status
      pdf_link
      id
    }
  }
`
export const useListPrayerbooks = () => {
  const {reload} = useReload()
  const {loading, error, data, refetch} = useQuery(LIST_PRAYERBOOKS_QUERY, {
    context: {headers: {authorization: `Bearer ${localStorage().getItem('auth_token')}`}},
  })
  React.useEffect(() => {
    refetch()
  }, [reload])
  let books = data
  if (data) {
    books = data.prayerbooks.map((pb) => {
      const newPb = {...pb}
      delete newPb.__typename
      return newPb
    })
  }
  return {loading, error, books}
}
