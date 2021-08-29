import React, {FC} from 'react'

import Link from 'next/link'
import {
    MdCancel, MdNewReleases, MdPauseCircleFilled, MdSwapVerticalCircle
} from 'react-icons/md'

import {
    Box, Container, Heading, Link as ChLink, List, ListIcon, ListItem, Text
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
      <Heading size="sm">An unofficial digitized library.</Heading>
      <Container>
        <Text as="i" fontSize="sm">
          This is a side-project of Aster Haven, a digital version of Kehilla Community Synagogue's
          online prayerbook PDFs. It is not official, by any means, and is not necessarily endorsed
          by Kehilla. I made this more so I can follow along easier during services. If you find a
          bug or you're interested in helping out, please contact Aster (
          <ChLink href="mailto:kehilla@aster.hn">kehilla@aster.hn</ChLink>) to get access/report
          bugs.
        </Text>
        <Text>
          For the original prayerbooks, see{' '}
          <ChLink href="http://kehillasynagogue.org/prayerbooks/">
            Kehilla's Official Website
          </ChLink>
          .
        </Text>
      </Container>
      <Box width="100%" height="32px" borderBottomWidth="1px" marginBottom="32px" />
      <List spacing={3}>
        {books.map((book) => {
          return (
            <ListItem display="flex" flexDirection="row" alignItems="center">
              <ListIcon as={statusIcons[book.status]} color={`${statusColors[book.status]}.500`} />
              <Link href={`/reading/${book.slug}`}>
                <ChLink>{book.name}</ChLink>
              </Link>
              <Box width="8px" height="24px" borderRightWidth="1px" marginRight="8px" />
              <ChLink fontSize="xs" href={book.pdf_link} target="_blank">
                Original PDF
              </ChLink>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
