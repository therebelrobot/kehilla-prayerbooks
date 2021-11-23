import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {extractOrderedPrayers} from '../utils/extractOrderedPrayers'
import {useQuery} from '../utils/useQuery'
import {GET_ALL_PRAYERS_BY_PAGE_QUERY} from './GET_ALL_PRAYERS_BY_PAGE_QUERY'

export const useGetAllPrayersByPageQuery = (bookSlug, page) => {
  const {data, ...rest} = useQuery(GET_ALL_PRAYERS_BY_PAGE_QUERY, {
    ...contextIfTokenPresent(),
    variables: {bookSlug, page},
  })
  const {prayers, orderedPrayers} = extractOrderedPrayers(data, bookSlug, page)
  console.log({prayers, orderedPrayers})
  return {...rest, prayers, orderedPrayers}
}
