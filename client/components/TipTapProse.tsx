import React, {useCallback} from 'react'

import {remove} from 'ramda'
import {CgTrash} from 'react-icons/cg'
import {throttle} from 'throttle-debounce'
import {TipTapMenuBar} from './TipTapMenuBar'

import {
    Box, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure
} from '@chakra-ui/react'
import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import {
    GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, GET_PRAYERS_PROSE_AND_LINES,
    useGetProseAndLines, useInsertProse, useRemoveProse, useUpdatePrayer,
    useUpdateProse
} from '_/services/Api/queries'
import {useEditing, useStore} from '_/services/state'

export const TipTapProse = ({content, prayerId, id, bookSlug, sectionSlug, prayerSlug, index}) => {
  const {activeEditId, setActiveEditId} = useEditing()
  const {insertProse, loading: insertLoading} = useInsertProse(bookSlug, sectionSlug, prayerSlug)
  const {updateProse, loading: updateLoading} = useUpdateProse(bookSlug, sectionSlug, prayerSlug)
  // console.log({activeEditId, id})

  const {isOpen, onOpen, onClose} = useDisclosure()
  const {removeProse} = useRemoveProse(activeEditId || id, prayerSlug, sectionSlug, bookSlug)

  const {lineProseOrder} = useGetProseAndLines(bookSlug, sectionSlug, prayerSlug)
  const {updatePrayer} = useUpdatePrayer(prayerId, bookSlug, sectionSlug)
  const updatePrayerCb = useCallback(() => {
    const newOrder = remove(index, 1, lineProseOrder)
    return updatePrayer({
      variables: {
        _set: {
          line_prose_order: newOrder,
        },
      },
      refetchQueries: [
        {query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, variables: {bookSlug, sectionSlug}},
        {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
      ],
    })
  }, [updatePrayer, JSON.stringify(lineProseOrder), bookSlug, sectionSlug, prayerSlug])

  const onUpdate = useCallback(
    (json) => {
      if (insertLoading || updateLoading) return
      const {activeEditId: directId} = useStore.getState()
      // console.log({directId, id})
      if (directId || id) {
        // console.log('upateProse')
        const variables = {tiptap_content: json, id: id || directId}
        updateProse({variables})
        return
      }

      // console.log('insertProse', activeEditId)
      const variables = {tiptap_content: json}
      insertProse({variables}).then((data) => {
        // console.log({data})
        if (data.data.insert_prose) {
          // console.log('insert', data.data.insert_prose.returning[0].id)
          setActiveEditId(data.data.insert_prose.returning[0].id)
          return
        }
        // console.log('update')
      })
    },
    [insertLoading, updateLoading, id, activeEditId, updateProse, insertProse, setActiveEditId]
  )

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onBlur: () => {
      setActiveEditId(null)
    },
    onUpdate: throttle(2000, ({editor}) => {
      const json = editor.getJSON()
      onUpdate(json)
      // send the content to an API here
    }),
  })
  if (!id || activeEditId) return null

  return (
    <Box marginY="0 !important" position="relative">
      <TipTapMenuBar editor={editor} />
      <Box p="16px" borderWidth="1px" borderTopWidth="0" borderBottomRadius="8px">
        <EditorContent editor={editor} />
      </Box>

      <>
        <IconButton
          aria-label="Delete this prose section"
          cursor="pointer"
          as={CgTrash}
          size="xs"
          colorScheme="red"
          position="absolute"
          right="0"
          bottom="0"
          borderTopLeftRadius="8px"
          borderBottomRightRadius="8px"
          onClick={onOpen}
        ></IconButton>
        <Modal onClose={onClose} size="xl" isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Prose Section</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this prose section?{' '}
              <Text fontWeight="bold" color="red.500">
                It cannot be undone.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>On second thought, nevermind.</Button>
              <Box boxSize="8px" />

              <Button
                colorScheme="red"
                onClick={() => {
                  removeProse().then(updatePrayerCb).then(onClose)
                }}
              >
                Yes, I want this gone forever.
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Box>
  )
}
