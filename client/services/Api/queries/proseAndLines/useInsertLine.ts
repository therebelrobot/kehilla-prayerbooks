import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_PRAYERS_PROSE_AND_LINES} from './GET_PRAYERS_PROSE_AND_LINES'
import {INSERT_LINE_MUTATION} from './INSERT_LINE_MUTATION'

export const useInsertLine = (bookSlug, sectionSlug, prayerSlug) => {
  const [insertLine, {loading, error, data}] = useMutation(INSERT_LINE_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {prayer_slug: prayerSlug},
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
    ],
  })
  return {insertLine, loading, error, data}
}
