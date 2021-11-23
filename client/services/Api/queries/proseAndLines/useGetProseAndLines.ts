import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {useQuery} from '../utils/useQuery'
import {GET_PRAYERS_PROSE_AND_LINES} from './GET_PRAYERS_PROSE_AND_LINES'

export const useGetProseAndLines = (bookSlug, sectionSlug, prayerSlug) => {
  // console.log('useGetSectionsByBookSlug', bookSlug)
  const {data, ...rest} = useQuery(GET_PRAYERS_PROSE_AND_LINES, {
    ...contextIfTokenPresent(),
    variables: {bookSlug, sectionSlug, prayerSlug},
  })

  let prose = []
  let lines = []
  let order = []
  let prayerId = null
  let prayer = null
  if (data) {
    prayerId = data.prayerbooks[0].sections[0].prayers[0].id
    prose = data.prayerbooks[0].sections[0].prayers[0].proses
    lines = data.prayerbooks[0].sections[0].prayers[0].prayer_lines
    order = data.prayerbooks[0].sections[0].prayers[0].line_prose_order || []
    prayer = data.prayerbooks[0].sections[0].prayers[0]
  }
  // console.log({prose, lines, order})
  const ordered = order.map((typeId) => {
    const [type, id] = typeId.split('-')
    if (type === 'prose') {
      const foundProse = prose.find((p) => p.id === Number(id))
      // console.log({foundProse, prose})
      return {...foundProse, type}
    }
    return {...lines.find((l) => l.id === Number(id)), type}
  })
  return {...rest, data, prayer, prose, lines, ordered, lineProseOrder: order, prayerId}
}
