import {Box, Heading, IconButton, Link as ChLink, List, ListItem, Spacer} from '@chakra-ui/react'
import Link from 'next/link'
import React, {FC} from 'react'
import {CgChevronLeftO} from 'react-icons/cg'
import {MdCancel, MdNewReleases, MdPauseCircleFilled, MdSwapVerticalCircle} from 'react-icons/md'
import {useGetPrayersBySectionAndBookSlug} from '_/services/Api/queries'

interface ListPrayersProps {
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

export const ListPrayers: FC<ListPrayersProps> = ({bookSlug, sectionSlug}) => {
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
            aria-label={`return to List of prayerbooks`}
          />
        </Link>
        <Spacer boxSize="8px" />
        {data.prayerbooks[0].name}
      </Heading>
      <Heading size="sm" display="flex" flexDirection="row" alignItems="center">
        {data.prayerbooks[0].sections[0].name}
      </Heading>

      <Box width="100%" mt="16px" mb="16px">
        {' '}
        <hr />
      </Box>
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
