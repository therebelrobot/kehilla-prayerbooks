import React, {FC} from 'react'

import Link from 'next/link'
import {
    MdCancel, MdNewReleases, MdPauseCircleFilled, MdSwapVerticalCircle
} from 'react-icons/md'

import {
    Box, Heading, Link as ChLink, List, ListIcon, ListItem
} from '@chakra-ui/react'

import {useListPrayerbooks} from '_/services/Api/queries'

interface ListPrayerbooksProps {}

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

export const ListPrayerbooks: FC<ListPrayerbooksProps> = ({}) => {
  const {loading, error, books} = useListPrayerbooks()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>
  return (
    <>
      <Heading>Kehilla Prayerbooks</Heading>
      <Heading size="sm">An unofficial digitized version.</Heading>
      <Box width="100%" height="32px" borderBottomWidth="1px" marginBottom="32px" />
      <List spacing={3}>
        {books.map((book) => {
          return (
            <ListItem display="flex" flexDirection="row" alignItems="center">
              <ListIcon as={statusIcons[book.status]} color={`${statusColors[book.status]}.500`} />
              <Link href={`/reading/${book.slug}`}>
                <ChLink>{book.name}</ChLink>
              </Link>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
