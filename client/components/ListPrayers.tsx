import {
  Box,
  Heading,
  IconButton,
  Link as ChLink,
  List,
  ListItem,
  Spacer,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import React, {FC} from 'react'
import {CgChevronLeftO} from 'react-icons/cg'
import {useGetPrayersBySectionAndBookSlug} from '_/services/Api/queries/prayers/useGetPrayersBySectionAndBookSlug'

interface ListPrayersProps {
  bookSlug: string
  sectionSlug: string
}

export const ListPrayers: FC<ListPrayersProps> = ({bookSlug, sectionSlug}) => {
  const {loading, error, data, orderedPrayers} = useGetPrayersBySectionAndBookSlug(
    bookSlug,
    sectionSlug
  )

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
        {orderedPrayers.map((prayer) => {
          const singlePage = prayer.from_page === prayer.to_page

          return (
            <ListItem display="flex" flexDirection="row" alignItems="center">
              <Link href={`/reading/${bookSlug}/${sectionSlug}/${prayer.slug}`}>
                <ChLink>{prayer.name}</ChLink>
              </Link>
              <Box boxSize="16px" />
              <Text fontSize="sm" opacity={0.55}>
                Source page{singlePage ? '' : 's'} {prayer.from_page}
                {singlePage ? '' : ` - ${prayer.to_page}`}
              </Text>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
