import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_SECTIONS_BY_BOOK_SLUG_QUERY} from './GET_SECTIONS_BY_BOOK_SLUG_QUERY'
import {INSERT_SECTION_MUTATION} from './INSERT_SECTION_MUTATION'

export const useInsertSection = (bookSlug) => {
  const [insertSection, {loading, error, data}] = useMutation(INSERT_SECTION_MUTATION, {
    ...contextIfTokenPresent(),
    refetchQueries: [{query: GET_SECTIONS_BY_BOOK_SLUG_QUERY, variables: {bookSlug}}],
  })
  return {insertSection, loading, error, data}
}
