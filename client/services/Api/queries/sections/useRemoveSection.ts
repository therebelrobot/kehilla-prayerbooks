import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_SECTIONS_BY_BOOK_SLUG_QUERY} from './GET_SECTIONS_BY_BOOK_SLUG_QUERY'
import {REMOVE_SECTION_MUTATION} from './REMOVE_SECTION_MUTATION'

export const useRemoveSection = (sectionId, bookSlug) => {
  const [removeSection, {loading, error, data}] = useMutation(REMOVE_SECTION_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {sectionId},
    refetchQueries: [{query: GET_SECTIONS_BY_BOOK_SLUG_QUERY, variables: {bookSlug}}],
  })

  return {removeSection, loading, error, data}
}
