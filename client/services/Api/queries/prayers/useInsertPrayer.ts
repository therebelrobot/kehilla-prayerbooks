import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY} from './GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY'
import {INSERT_PRAYER_MUTATION} from './INSERT_PRAYER_MUTATION'

export const useInsertPrayer = (bookSlug, sectionSlug) => {
  const [insertPrayer, {loading, error, data}] = useMutation(INSERT_PRAYER_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {book_slug: bookSlug, section_slug: sectionSlug},
    refetchQueries: [
      {query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, variables: {bookSlug, sectionSlug}},
    ],
  })
  return {insertPrayer, loading, error, data}
}
