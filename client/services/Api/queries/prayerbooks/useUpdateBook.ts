import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {LIST_PRAYERBOOKS_QUERY} from './LIST_PRAYERBOOKS_QUERY'
import {UPDATE_BOOK_MUTATION} from './UPDATE_BOOK_MUTATION'

export const useUpdateBook = (bookId) => {
  const [updateBook, {loading, error, data}] = useMutation(UPDATE_BOOK_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {bookId},
    refetchQueries: [{query: LIST_PRAYERBOOKS_QUERY}],
  })

  return {updateBook, loading, error, data}
}
