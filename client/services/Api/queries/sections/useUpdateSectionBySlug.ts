import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_SECTIONS_BY_BOOK_SLUG_QUERY} from './GET_SECTIONS_BY_BOOK_SLUG_QUERY'
import {UPDATE_SECTION_BY_SLUG_MUTATION} from './UPDATE_SECTION_BY_SLUG_MUTATION'

export const useUpdateSectionBySlug = (sectionSlug, bookSlug) => {
  const [updateSection, {loading, error, data}] = useMutation(UPDATE_SECTION_BY_SLUG_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {sectionSlug, bookSlug},
    refetchQueries: [{query: GET_SECTIONS_BY_BOOK_SLUG_QUERY, variables: {bookSlug}}],
  })

  return {updateSection, loading, error, data}
}
