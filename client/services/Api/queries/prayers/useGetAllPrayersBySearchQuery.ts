import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {extractOrderedPrayers} from '../utils/extractOrderedPrayers'
import {useQuery} from '../utils/useQuery'
import {GET_ALL_PRAYERS_BY_SEARCH_QUERY} from './GET_ALL_PRAYERS_BY_SEARCH_QUERY'

export const useGetAllPrayersBySearchQuery = (bookSlug, query) => {
  const {data, ...rest} = useQuery(GET_ALL_PRAYERS_BY_SEARCH_QUERY, {
    ...contextIfTokenPresent(),
    variables: {bookSlug, query: query.length ? `%${query}%` : ''},
  })
  const {prayers, orderedPrayers} = extractOrderedPrayers(data, bookSlug, query)
  console.log({prayers, orderedPrayers})
  return {...rest, prayers, orderedPrayers}
}
