import React, {useRef} from 'react'

import {useRouter} from 'next/router'
import {useHoverDirty} from 'react-use'
import {ExpandingMenuButton} from './ExpandingMenuButton'
import {PageSearchPanel} from './PageSearchPanel'

import {
    Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
    ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs,
    useColorModeValue, useDisclosure
} from '@chakra-ui/react'
import {RiFileSearchLine} from '@hacknug/react-icons/ri'

import {TextSearchPanel} from '_/components/TextSearchPanel'

const bgColor = {light: 'white', dark: 'rgb(26, 32, 44)'}

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
                  <TextSearchPanel bookSlug={book} onClose={onClose} />
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
