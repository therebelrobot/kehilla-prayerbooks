import React from 'react'

import debounce from 'debounce-promise'

import {gql, useMutation, useQuery} from '@apollo/client'

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

const INSERT_PROSE_MUTATION = gql`
  mutation ($prayer_id: Int, $tiptap_content: jsonb) {
    insert_prose(
      objects: [{prayer_id: $prayer_id, tiptap_content: $tiptap_content}]
      on_conflict: {constraint: prose_pkey, update_columns: [tiptap_content]}
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`
const UPDATE_PROSE_MUTATION = gql`
  mutation ($id: Int, $prayer_id: Int, $tiptap_content: jsonb) {
    update_prose(where: {id: {_eq: $id}}, _set: {tiptap_content: $tiptap_content}) {
      affected_rows
      returning {
        id
      }
    }
  }
`
export const useUpsertProse = (idPresent) => {
  const [upsert, {loading, error, data}] = useMutation(
    idPresent ? UPDATE_PROSE_MUTATION : INSERT_PROSE_MUTATION,
    {
      context: {headers: {authorization: `Bearer ${localStorage().getItem('auth_token')}`}},
    }
  )
  const upsertProse = debounce(upsert, 2000, {leading: true})
  console.log({mutationData: data})
  return {upsertProse, loading, error, data}
}
