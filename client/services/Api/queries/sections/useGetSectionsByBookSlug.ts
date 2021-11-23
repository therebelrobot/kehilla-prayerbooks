import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {useQuery} from '../utils/useQuery'
import {GET_SECTIONS_BY_BOOK_SLUG_QUERY} from './GET_SECTIONS_BY_BOOK_SLUG_QUERY'

export const useGetSectionsByBookSlug = (bookSlug) => {
  // console.log('useGetSectionsByBookSlug', bookSlug)
  const {data, ...rest} = useQuery(GET_SECTIONS_BY_BOOK_SLUG_QUERY, {
    ...contextIfTokenPresent(),
    variables: {bookSlug},
  })

  let sections = []
  let status = 'UNSTARTED'
  let sectionOrder = []
  let orderedSections = []
  let bookId = null

  if (data) {
    sections = data.prayerbooks[0].sections.map((s) => ({
      ...s,
      toFromPages: [
        s.prayers_aggregate.aggregate.min.from_page || 0,
        s.prayers_aggregate.aggregate.max.to_page || 0,
      ],
    }))
    status = data.prayerbooks[0].status
    sectionOrder = data.prayerbooks[0].section_order || []
    orderedSections = sectionOrder.map((id) => sections.find((s) => s.id === id)).filter(Boolean)
    bookId = data.prayerbooks[0].id
    console.log({sections, status, sectionOrder, orderedSections})
  }
  return {...rest, data, sections, status, sectionOrder, orderedSections, bookId}
}
