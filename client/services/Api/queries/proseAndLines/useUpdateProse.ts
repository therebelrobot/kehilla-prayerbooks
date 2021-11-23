import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_PRAYERS_PROSE_AND_LINES} from './GET_PRAYERS_PROSE_AND_LINES'
import {UPDATE_PROSE_MUTATION} from './UPDATE_PROSE_MUTATION'

export const useUpdateProse = (bookSlug, sectionSlug, prayerSlug) => {
  const [updateProse, {loading, error, data}] = useMutation(UPDATE_PROSE_MUTATION, {
    ...contextIfTokenPresent(),
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
    ],
  })

  return {updateProse, loading, error, data}
}
