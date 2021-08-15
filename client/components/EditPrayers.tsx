import React, {FC} from 'react'

import Link from 'next/link'
import {CgChevronLeftO} from 'react-icons/cg'
import {
    MdCancel, MdNewReleases, MdPauseCircleFilled, MdSwapVerticalCircle
} from 'react-icons/md'

import {
    Heading, IconButton, Link as ChLink, List, ListItem, Spacer
} from '@chakra-ui/react'

import {useGetPrayersBySectionAndBookSlug} from '_/services/Api/queries'

interface EditPrayersProps {
  bookSlug: string
  sectionSlug: string
}

const statusIcons = {
  UNSTARTED: MdCancel,
  IN_PROGRESS: MdSwapVerticalCircle,
  STALLED: MdPauseCircleFilled,
  COMPLETE: MdNewReleases,
}
const statusColors = {
  UNSTARTED: 'gray',
  IN_PROGRESS: 'orange',
  STALLED: 'red',
  COMPLETE: 'green',
}

export const EditPrayers: FC<EditPrayersProps> = ({bookSlug, sectionSlug}) => {
  const {loading, error, data, prayers} = useGetPrayersBySectionAndBookSlug(bookSlug, sectionSlug)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>
  return (
    <>
      <Heading size="md" display="flex" flexDirection="row" alignItems="center">
        <Link href={`/reading/${bookSlug}`}>
          <IconButton
            icon={<CgChevronLeftO />}
            size="xs"
            aria-label={`return to ${data.prayerbooks[0].sections[0].name}`}
          />
        </Link>
        <Spacer boxSize="8px" />
        {data.prayerbooks[0].sections[0].name} Prayers
      </Heading>
      <List spacing={3}>
        {prayers.map((prayer) => {
          return (
            <ListItem display="flex" flexDirection="row" alignItems="center">
              <Link href={`/reading/${bookSlug}/${sectionSlug}/${prayer.slug}`}>
                <ChLink>{prayer.name}</ChLink>
              </Link>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
