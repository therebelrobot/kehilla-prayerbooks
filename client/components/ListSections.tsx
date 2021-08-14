import React, {FC} from 'react'

import Link from 'next/link'
import {CgChevronLeftO} from 'react-icons/cg'
import {
    MdCancel, MdNewReleases, MdPauseCircleFilled, MdSwapVerticalCircle
} from 'react-icons/md'

import {
    Heading, IconButton, Link as ChLink, List, ListItem, Spacer
} from '@chakra-ui/react'

import {useGetSectionsByBookSlug} from '_/services/Api/queries'

interface ListSectionsProps {
  bookSlug: string
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

export const ListSections: FC<ListSectionsProps> = ({bookSlug}) => {
  const {loading, error, data, sections} = useGetSectionsByBookSlug(bookSlug)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>
  return (
    <>
      <Heading size="md" display="flex" flexDirection="row" alignItems="center">
        <Link href={`/reading/`}>
          <IconButton
            icon={<CgChevronLeftO />}
            size="xs"
            aria-label={`return to List of prayerbooks`}
          />
        </Link>
        <Spacer boxSize="8px" />
        {data.prayerbooks[0].name} Sections
      </Heading>
      <List spacing={3}>
        {sections.map((section) => {
          return (
            <ListItem display="flex" flexDirection="row" alignItems="center">
              <Link href={`/reading/${bookSlug}/${section.slug}`}>
                <ChLink>{section.name}</ChLink>
              </Link>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
