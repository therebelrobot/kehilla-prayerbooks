import {useLazyQuery} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_PRAYERS_BY_SECTION_ID_AND_BOOK_SLUG_QUERY} from './GET_PRAYERS_BY_SECTION_ID_AND_BOOK_SLUG_QUERY'

export const useLazyGetPrayersBySectionIdAndBookSlug = (bookSlug) => {
  // console.log('useGetSectionsByBookSlug', bookSlug)
  const [getPrayer, {data, ...rest}] = useLazyQuery(GET_PRAYERS_BY_SECTION_ID_AND_BOOK_SLUG_QUERY, {
    ...contextIfTokenPresent(),
    variables: {bookSlug},
  })

  let prayers = []
  let prayerOrder = []
  let sectionOrder = []
  let orderedPrayers = []
  let sectionId = null
  let book = null
  if (data) {
    prayers = data.prayerbooks[0].sections[0].prayers
    prayerOrder = data.prayerbooks[0].sections[0].prayer_order
    sectionOrder = data.prayerbooks[0].section_order
    orderedPrayers = prayerOrder.map((id) => prayers.find((p) => p.id === id)).filter(Boolean)
    sectionId = data.prayerbooks[0].sections[0].id
    book = data.prayerbooks[0]
  }
  return {
    ...rest,
    data,
    prayers,
    prayerOrder,
    sectionOrder,
    orderedPrayers,
    sectionId,
    book,
    getPrayer,
  }
}
