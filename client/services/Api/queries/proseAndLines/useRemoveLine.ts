import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_PRAYERS_PROSE_AND_LINES} from './GET_PRAYERS_PROSE_AND_LINES'
import {REMOVE_LINE_MUTATION} from './REMOVE_LINE_MUTATION'

export const useRemoveLine = (id, prayerSlug, sectionSlug, bookSlug) => {
  // console.log('useRemoveLine', {id, prayerSlug, sectionSlug, bookSlug})
  const [removeLine, {loading, error, data}] = useMutation(REMOVE_LINE_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {id},
    refetchQueries: [
      {query: GET_PRAYERS_PROSE_AND_LINES, variables: {prayerSlug, sectionSlug, bookSlug}},
    ],
  })

  return {removeLine, loading, error, data}
}
