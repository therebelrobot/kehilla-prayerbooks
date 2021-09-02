import React, {useRef, useState} from 'react'

import Link from 'next/link'
import {useRouter} from 'next/router'
import {useHoverDirty} from 'react-use'
import {ExpandingMenuButton} from './ExpandingMenuButton'

import {
    Box, Button, Container, Link as ChLink, List, ListItem, Modal, ModalBody,
    ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    NumberDecrementStepper, NumberIncrementStepper, NumberInput,
    NumberInputField, NumberInputStepper, Tab, TabList, TabPanel, TabPanels,
    Tabs, Text, useColorModeValue, useDisclosure
} from '@chakra-ui/react'
import {RiFileSearchLine} from '@hacknug/react-icons/ri'

import {useGetAllPrayersByPageQuery} from '_/services/Api/queries'

const bgColor = {light: 'white', dark: 'rgb(26, 32, 44)'}

const PageSearchPanel = ({bookSlug, onClose}) => {
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
              return (
                <ListItem>
                  <Link href={`/reading/${bookSlug}/${p.section.slug}/${p.slug}`}>
                    <ChLink onClick={onClose}>
                      {p.name} - {p.section.name}
                    </ChLink>
                  </Link>
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

export const SearchMenu = () => {
  const boxRef = useRef(null)
  const isHovering = useHoverDirty(boxRef)
  const bg = useColorModeValue('white', 'gray.800')

  const {isOpen, onOpen, onClose} = useDisclosure()

  const router = useRouter()
  const {query} = router
  const {bookPath = []} = query
  const [book] = bookPath as string[]

  if (!book) return null
  return (
    <>
      <Box
        bg={bg}
        ref={boxRef}
        position="fixed"
        left="0"
        top="200px"
        display="flex"
        flexDirection="column"
      >
        <ExpandingMenuButton
          isHovering={isHovering}
          onClick={() => {
            return isOpen ? onClose() : onOpen()
            // toggleShowTrans()
          }}
        >
          <Box marginLeft="12px" marginRight="12px" as={RiFileSearchLine} />
          Page Lookup &amp; Search
        </ExpandingMenuButton>
      </Box>
      <Modal onClose={onClose} size="full" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent marginTop={0}>
          <ModalHeader>Page Lookup &amp; Search</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs
              defaultIndex={0}
              variant="soft-rounded"
              onChange={(index) => {
                console.log({index})
              }}
            >
              <TabList>
                <Tab>Page #</Tab>
                <Tab>Text Search</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <PageSearchPanel bookSlug={book} onClose={onClose} />
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
