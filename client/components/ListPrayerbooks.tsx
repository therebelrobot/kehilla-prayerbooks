import React, {FC} from 'react'

import {
    MdCancel, MdNewReleases, MdPauseCircleFilled, MdSwapVerticalCircle
} from 'react-icons/md'

import {List, ListIcon, ListItem, Text} from '@chakra-ui/react'

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
  if (error) return <p>Error :(</p>
  return (
    <>
      <List spacing={3}>
        {books.map((book) => {
          return (
            <ListItem display="flex" flexDirection="row" alignItems="center">
              <ListIcon as={statusIcons[book.status]} color={`${statusColors[book.status]}.500`} />
              <Text>{book.name}</Text>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
