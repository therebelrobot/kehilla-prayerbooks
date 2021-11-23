import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {useQuery} from '../utils/useQuery'
import {LIST_PRAYERBOOKS_QUERY} from './LIST_PRAYERBOOKS_QUERY'

export const useListPrayerbooks = () => {
  const {data, ...rest} = useQuery(LIST_PRAYERBOOKS_QUERY, contextIfTokenPresent())
  let books = data
  if (data) {
    books = data.prayerbooks.map((pb) => {
      const newPb = {...pb}
      delete newPb.__typename
      return newPb
    })
  }
  return {...rest, books}
}
