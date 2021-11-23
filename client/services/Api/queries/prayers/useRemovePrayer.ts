import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY} from './GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY'
import {REMOVE_PRAYER_MUTATION} from './REMOVE_PRAYER_MUTATION'

export const useRemovePrayer = (prayerId, bookSlug, sectionSlug) => {
  const [removePrayer, {loading, error, data}] = useMutation(REMOVE_PRAYER_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {prayerId},
    refetchQueries: [
      {query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, variables: {bookSlug, sectionSlug}},
    ],
  })

  return {removePrayer, loading, error, data}
}
