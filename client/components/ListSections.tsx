import {
  Box,
  Button,
  Container,
  Heading,
  Link as ChLink,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import React, {FC} from 'react'
import {CgChevronLeftO} from 'react-icons/cg'
import {useGetSectionsByBookSlug} from '_/services/Api/queries/sections/useGetSectionsByBookSlug'

interface ListSectionsProps {
  bookSlug: string
}

export const ListSections: FC<ListSectionsProps> = ({bookSlug}) => {
  const {loading, error, data, sections, orderedSections, status} =
    useGetSectionsByBookSlug(bookSlug)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>
  return (
    <>
      <Link href={`/reading/`}>
        <Button size="xs" leftIcon={<CgChevronLeftO />} variant="solid" mb={8}>
          Back to library
        </Button>
      </Link>
      <Heading size="md" display="flex" flexDirection="row" alignItems="center">
        {data.prayerbooks[0].name}
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
        {orderedSections.map((section) => {
          const singlePage = section.toFromPages[0] === section.toFromPages[1]
          return (
            <ListItem display="flex" flexDirection="row" alignItems="center">
              <Link href={`/reading/${bookSlug}/${section.slug}`}>
                <ChLink>{section.name}</ChLink>
              </Link>
              <Box boxSize="16px" />
              <Text fontSize="sm" opacity={0.55}>
                Source page{singlePage ? '' : 's'} {section.toFromPages[0]}
                {singlePage ? '' : ` - ${section.toFromPages[1]}`}
              </Text>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
