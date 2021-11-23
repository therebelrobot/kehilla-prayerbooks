import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {LIST_PRAYERBOOKS_QUERY} from './LIST_PRAYERBOOKS_QUERY'
import {UPDATE_BOOK_MUTATION_BY_SLUG} from './UPDATE_BOOK_MUTATION_BY_SLUG'

export const useUpdateBookBySlug = (bookSlug) => {
  const [updateBook, {loading, error, data}] = useMutation(UPDATE_BOOK_MUTATION_BY_SLUG, {
    ...contextIfTokenPresent(),
    variables: {bookSlug},
    refetchQueries: [{query: LIST_PRAYERBOOKS_QUERY}],
  })

  return {updateBook, loading, error, data}
}
