import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_PRAYERS_PROSE_AND_LINES} from './GET_PRAYERS_PROSE_AND_LINES'
import {INSERT_PROSE_MUTATION} from './INSERT_PROSE_MUTATION'

export const useInsertProse = (bookSlug, sectionSlug, prayerSlug) => {
  const [insertProse, {loading, error, data}] = useMutation(INSERT_PROSE_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {prayer_slug: prayerSlug},
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
    ],
  })
  return {insertProse, loading, error, data}
}
