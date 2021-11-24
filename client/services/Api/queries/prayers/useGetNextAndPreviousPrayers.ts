import {useGetPrayersBySectionAndBookSlug} from '_/services/Api/queries/prayers/useGetPrayersBySectionAndBookSlug'
import {useLazyGetPrayersBySectionIdAndBookSlug} from '_/services/Api/queries/prayers/useLazyGetPrayersBySectionIdAndBookSlug'

export const useGetNextAndPreviousPrayers = (bookSlug, sectionSlug, prayerSlug) => {
  const {orderedPrayers, sectionOrder, sectionId} = useGetPrayersBySectionAndBookSlug(
    bookSlug,
    sectionSlug
  )
  const {
    getPrayer: getNextSectionPrayer,
    orderedPrayers: [nextSectionPrayer],
    loading: nextLoading,
    error: nextError,
  } = useLazyGetPrayersBySectionIdAndBookSlug(bookSlug)
  const {
    getPrayer: getPrevSectionPrayer,
    orderedPrayers: previousOrderedPrayers,
    loading: prevLoading,
    error: prevError,
  } = useLazyGetPrayersBySectionIdAndBookSlug(bookSlug)
  const prevSectionPrayer = previousOrderedPrayers[previousOrderedPrayers.length - 1]
  const prayerIndex = orderedPrayers.map((p) => p.slug).indexOf(prayerSlug)
  const sectionIndex = sectionOrder.indexOf(sectionId)
  const isFirst = prayerIndex === 0
  const isLast = prayerIndex === orderedPrayers.length - 1
  const isFirstSection = sectionIndex === 0
  const isLastSection = sectionIndex === sectionOrder.length - 1
  let next = nextSectionPrayer || null
  let prev = prevSectionPrayer || null
  if (!isFirst) {
    prev = orderedPrayers[prayerIndex - 1]
  } else if (!prev && !isFirstSection && !prevLoading && !prevError) {
    const previousSectionId = sectionOrder[sectionIndex - 1]
    getPrevSectionPrayer({variables: {sectionId: previousSectionId}})
  }
  if (!isLast) {
    next = orderedPrayers[prayerIndex + 1]
  } else if (!next && !isLastSection && !nextLoading && !nextError) {
    const nextSectionId = sectionOrder[sectionIndex + 1]
    getNextSectionPrayer({variables: {sectionId: nextSectionId}})
  }
  // get current section's order
  // find current prayer in section's order
  // if beginning of section,
  //   get current book's section order
  //   find current section in book's order
  //   get previous section
  //   get last in previous section
  // if end of section,
  //   get current book's section order
  //   find current section in book's order
  //   get next section
  //   get first in next section
  return {next, prev}
}
