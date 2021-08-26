import {Box} from '@chakra-ui/react'
import * as React from 'react'
import {ListPrayerbooks} from '_/components/ListPrayerbooks'
import {ListPrayers} from '_/components/ListPrayers'
import {ListSections} from '_/components/ListSections'
import {ShowPrayer} from '_/components/ShowPrayer'

export const ReadingLayout = ({book, section, prayer, line}) => {
  // Homepage layout is created here.
  // Do not put state handling here (Graphql, useState, etc.)
  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center" paddingY="64px">
      {!book && <ListPrayerbooks />}
      {book && !section && <ListSections bookSlug={book} />}
      {book && section && !prayer && <ListPrayers bookSlug={book} sectionSlug={section} />}
      {book && section && prayer && (
        <ShowPrayer bookSlug={book} sectionSlug={section} prayerSlug={prayer} />
      )}
    </Box>
  )
}
