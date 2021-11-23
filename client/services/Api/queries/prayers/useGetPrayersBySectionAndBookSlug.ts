import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {useQuery} from '../utils/useQuery'
import {GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY} from './GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY'

export const useGetPrayersBySectionAndBookSlug = (bookSlug, sectionSlug) => {
  // console.log('useGetSectionsByBookSlug', bookSlug)
  const {data, ...rest} = useQuery(GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, {
    ...contextIfTokenPresent(),
    variables: {bookSlug, sectionSlug},
  })

  let prayers = []
  let prayerOrder = []
  let orderedPrayers = []
  let sectionId = null
  if (data) {
    prayers = data.prayerbooks[0].sections[0].prayers
    prayerOrder = data.prayerbooks[0].sections[0].prayer_order
    orderedPrayers = prayerOrder.map((id) => prayers.find((p) => p.id === id)).filter(Boolean)
    sectionId = data.prayerbooks[0].sections[0].id
  }
  return {...rest, data, prayers, prayerOrder, orderedPrayers, sectionId}
}
