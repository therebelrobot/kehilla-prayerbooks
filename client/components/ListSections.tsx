import React, {FC} from 'react'

import Link from 'next/link'
import {CgChevronLeftO} from 'react-icons/cg'
import {
    MdCancel, MdNewReleases, MdPauseCircleFilled, MdSwapVerticalCircle
} from 'react-icons/md'

import {
    Box, Container, Heading, IconButton, Link as ChLink, List, ListItem, Spacer,
    Text
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
  const {loading, error, data, sections, status} = useGetSectionsByBookSlug(bookSlug)

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
      <Box width="100%" height="16px" />
      <Container>
        {status === 'UNSTARTED' && (
          <Text as="i" fontSize="sm">
            This prayerbook is currently <Text as="b">unstarted</Text>. If you would like to start
            getting it transferred, please contact Aster (
            <ChLink href="mailto:kehilla@aster.hn">kehilla@aster.hn</ChLink>) to get access.
          </Text>
        )}
        {status === 'IN_PROGRESS' && (
          <Text as="i" fontSize="sm">
            This prayerbook is currently <Text as="b">in progress</Text> of being transferred,
            meaning it is still incomplete and some things may be missing. If you would like to help
            getting it transferred, please contact Aster (
            <ChLink href="mailto:kehilla@aster.hn">kehilla@aster.hn</ChLink>) to get access.
          </Text>
        )}
        {status === 'STALLED' && (
          <Text as="i" fontSize="sm">
            This prayerbook is currently <Text as="b">stalled</Text>, meaning it's incomplete, but
            no one is working on it currently. If you would like to take over getting it
            transferred, please contact Aster (
            <ChLink href="mailto:kehilla@aster.hn">kehilla@aster.hn</ChLink>) to get access.
          </Text>
        )}
      </Container>
      <Box width="100%" mt="16px" mb="16px">
        {' '}
        <hr />
      </Box>
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
