import {useMutation} from '@apollo/client'
import {GET_PRAYERS_PROSE_AND_LINES} from '../proseAndLines/GET_PRAYERS_PROSE_AND_LINES'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY} from './GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY'
import {UPDATE_PRAYER_MUTATION} from './UPDATE_PRAYER_MUTATION'

export const useUpdatePrayer = (prayerId, book_slug, section_slug, prayerSlug = '') => {
  const [updatePrayer, {loading, error, data}] = useMutation(UPDATE_PRAYER_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {prayerId},
    refetchQueries: [
      {query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, variables: {book_slug, section_slug}},
      ...(prayerSlug.length
        ? [
            {
              query: GET_PRAYERS_PROSE_AND_LINES,
              variables: {bookSlug: book_slug, sectionSlug: section_slug, prayerSlug},
            },
          ]
        : []),
    ],
  })

  return {updatePrayer, loading, error, data}
}
