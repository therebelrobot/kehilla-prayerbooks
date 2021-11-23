import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {INSERT_BOOK_MUTATION} from './INSERT_BOOK_MUTATION'
import {LIST_PRAYERBOOKS_QUERY} from './LIST_PRAYERBOOKS_QUERY'

export const useInsertBook = () => {
  const [insertBook, {loading, error, data}] = useMutation(INSERT_BOOK_MUTATION, {
    ...contextIfTokenPresent(),
    refetchQueries: [{query: LIST_PRAYERBOOKS_QUERY}],
  })
  return {insertBook, loading, error, data}
}
