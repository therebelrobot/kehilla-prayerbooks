import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_PRAYERS_PROSE_AND_LINES} from './GET_PRAYERS_PROSE_AND_LINES'
import {REMOVE_PROSE_MUTATION} from './REMOVE_PROSE_MUTATION'

export const useRemoveProse = (id, prayerSlug, sectionSlug, bookSlug) => {
  // console.log('useRemoveProse', {id, prayerSlug, sectionSlug, bookSlug})
  const [removeProse, {loading, error, data}] = useMutation(REMOVE_PROSE_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {id},
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {prayerSlug, sectionSlug, bookSlug}},
    ],
  })

  return {removeProse, loading, error, data}
}
