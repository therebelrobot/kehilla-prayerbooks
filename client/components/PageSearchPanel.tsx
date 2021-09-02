import React, {useState} from 'react'

import Link from 'next/link'

import {
    Box, Container, Link as ChLink, List, ListItem, NumberDecrementStepper,
    NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
    Text
} from '@chakra-ui/react'

import {useGetAllPrayersByPageQuery} from '_/services/Api/queries'

export const PageSearchPanel = ({bookSlug, onClose}) => {
  const [pageNumber, setPageNumber] = useState(1)

  const {orderedPrayers, loading, error} = useGetAllPrayersByPageQuery(bookSlug, pageNumber)

  return (
    <Box width="100%" display="flex" flexDirection="column">
      <NumberInput
        value={pageNumber}
        onChange={(valueString) => {
          setPageNumber(Number(valueString))
        }}
        min={1}
        max={100}
        mb="16px"
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
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
              No prayers found for page {pageNumber}. This may mean the page hasn't been transferred
              in yet, or the page doesn't exist.
            </Text>
          </Container>
        )}
      </Box>
    </Box>
  )
}
