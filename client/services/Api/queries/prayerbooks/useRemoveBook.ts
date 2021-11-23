import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {LIST_PRAYERBOOKS_QUERY} from './LIST_PRAYERBOOKS_QUERY'
import {REMOVE_BOOK_MUTATION} from './REMOVE_BOOK_MUTATION'

export const useRemoveBook = (bookId) => {
  const [removeBook, {loading, error, data}] = useMutation(REMOVE_BOOK_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {bookId},
    refetchQueries: [{query: LIST_PRAYERBOOKS_QUERY}],
  })

  return {removeBook, loading, error, data}
}
