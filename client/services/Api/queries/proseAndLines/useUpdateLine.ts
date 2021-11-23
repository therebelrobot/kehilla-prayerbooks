import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_PRAYERS_PROSE_AND_LINES} from './GET_PRAYERS_PROSE_AND_LINES'
import {UPDATE_LINE_MUTATION} from './UPDATE_LINE_MUTATION'

export const useUpdateLine = (bookSlug, sectionSlug, prayerSlug) => {
  const [updateLine, {loading, error, data}] = useMutation(UPDATE_LINE_MUTATION, {
    ...contextIfTokenPresent(),
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
    ],
  })

  return {updateLine, loading, error, data}
}
