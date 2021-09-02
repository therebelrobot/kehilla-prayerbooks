import React, {useState} from 'react'

import Link from 'next/link'
import {RiSearch2Line} from 'react-icons/ri'

import {
    Box, Container, Input, InputGroup, InputLeftElement, Link as ChLink, List,
    ListItem, Text
} from '@chakra-ui/react'

import {useGetAllPrayersBySearchQuery} from '_/services/Api/queries'

export const TextSearchPanel = ({bookSlug, onClose}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const {orderedPrayers, loading, error} = useGetAllPrayersBySearchQuery(bookSlug, searchQuery)

  return (
    <Box width="100%" display="flex" flexDirection="column">
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Box as={RiSearch2Line} color="gray.300" />}
        />
        <Input
          placeholder="Search for Prayer by Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      <hr />
      <Box mt="16px">
        {loading && 'Searching...'}
        {error && 'Something went wrong.'}
        {!!orderedPrayers.length && (
          <List>
            {orderedPrayers.map((p) => {
              const singlePage = p.from_page === p.to_page
              return (
                <ListItem display="flex" flexDirection="row">
                  <Link href={`/reading/${bookSlug}/${p.section.slug}/${p.slug}`}>
                    <ChLink onClick={onClose}>{p.name} -</ChLink>
                  </Link>
                  <Box boxSize="16px" />
                  <Text fontSize="sm" opacity={0.55}>
                    {p.section.name}
                  </Text>
                  <Box boxSize="16px" />
                  <Text fontSize="sm" opacity={0.55}>
                    PDF page{singlePage ? '' : 's'} {p.from_page || '?'}
                    {singlePage ? '' : ` - ${p.to_page}`}
                  </Text>
                </ListItem>
              )
            })}
          </List>
        )}
        {!loading && !error && !orderedPrayers.length && (
          <Container>
            <Text as="i">
              No prayers found for query "{searchQuery}". This may mean the prayer hasn't been
              transferred in yet, or that it doesn't exist.
            </Text>
          </Container>
        )}
      </Box>
    </Box>
  )
}
