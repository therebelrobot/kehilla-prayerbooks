import {eqProps, flatten, uniqWith} from 'ramda'

export const extractOrderedPrayers = (data, bookSlug, pageOrQuery) => {
  let prayers = []
  let orderedPrayers = []
  if (bookSlug && pageOrQuery && data) {
    prayers = data.prayers
    if (prayers.length) {
      const dupedSections = prayers.map((p) => p.section)
      const idEq = eqProps('id')
      const sections = uniqWith(idEq)(dupedSections)
      const hasMoreThanOneSection = sections.length > 1
      console.log({sections, dupedSections, prayers, bookSlug, pageOrQuery})
      if (!hasMoreThanOneSection) {
        const prayerOrder = prayers[0].section.prayer_order
        orderedPrayers = prayerOrder.map((id) => prayers.find((p) => p.id === id)).filter(Boolean)
      } else {
        // these searches will NOT span prayerbooks, only sections
        console.log(prayers[0])
        const sectionOrder = prayers[0].section.prayerbook.section_order
        orderedPrayers = flatten(
          sectionOrder.map((sectionId) => {
            const thisSection = sections.find((s) => s.id === sectionId)
            if (!thisSection) return null
            const thisSectionOrderedPrayers = thisSection.prayer_order.map((id) =>
              prayers.filter((p) => p.section.id === sectionId).find((p) => p.id === id)
            )
            return thisSectionOrderedPrayers
          })
        ).filter(Boolean)
      }
    }
  }
  return {prayers, orderedPrayers}
}
