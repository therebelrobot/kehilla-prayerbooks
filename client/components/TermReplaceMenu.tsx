import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import React, {useRef, useState} from 'react'
import {VscReplace} from 'react-icons/vsc'
import {useHoverDirty} from 'react-use'
import {useDebouncyEffect} from 'use-debouncy'
import {useTermReplace} from '_/services/state'
import {ExpandingMenuButton} from './ExpandingMenuButton'

const bgColor = {light: 'white', dark: 'rgb(26, 32, 44)'}

const types = [
  {
    code: 'en',
    name: 'english',
  },
  {
    code: 'tr',
    name: 'transliteration',
  },
  {
    code: 'hb',
    name: 'hebrew',
  },
] as const

export const TermReplaceMenu = () => {
  const boxRef = useRef(null)
  const isHovering = useHoverDirty(boxRef)
  const bg = useColorModeValue('white', 'gray.800')

  const {isOpen, onOpen, onClose} = useDisclosure()

  const {termReplace, toggleTermReplace, editTermReplaceTargets, updateTermReplaceReplacement} =
    useTermReplace()
  const workingTargets = {
    en: useState(termReplace.target.en.join(',')),
    tr: useState(termReplace.target.tr.join(',')),
    hb: useState(termReplace.target.hb.join(',')),
  }
  const workingReplacements = {
    en: useState(termReplace.replacement.en),
    tr: useState(termReplace.replacement.tr),
    hb: useState(termReplace.replacement.hb),
  }

  // English update
  useDebouncyEffect(
    () => {
      if (workingTargets.en[0] === termReplace.target.en.join(',')) return
      editTermReplaceTargets('en', workingTargets.en[0])
    },
    500,
    [workingTargets.en, termReplace.target.en.join(','), editTermReplaceTargets]
  )
  useDebouncyEffect(
    () => {
      if (workingReplacements.en[0] === termReplace.replacement.en) return
      updateTermReplaceReplacement('en', workingReplacements.en[0])
    },
    500,
    [workingReplacements.en, termReplace.replacement.en, updateTermReplaceReplacement]
  )

  // Transliteration update
  useDebouncyEffect(
    () => {
      if (workingTargets.tr[0] === termReplace.target.tr.join(',')) return
      editTermReplaceTargets('tr', workingTargets.tr[0])
    },
    500,
    [workingTargets.tr, termReplace.target.tr.join(','), editTermReplaceTargets]
  )
  useDebouncyEffect(
    () => {
      if (workingReplacements.tr[0] === termReplace.replacement.tr) return
      updateTermReplaceReplacement('tr', workingReplacements.tr[0])
    },
    500,
    [workingReplacements.tr, termReplace.replacement.tr, updateTermReplaceReplacement]
  )

  //  Hebrew update
  useDebouncyEffect(
    () => {
      if (workingTargets.hb[0] === termReplace.target.hb.join(',')) return
      editTermReplaceTargets('hb', workingTargets.hb[0])
    },
    500,
    [workingTargets.hb, termReplace.target.hb.join(','), editTermReplaceTargets]
  )
  useDebouncyEffect(
    () => {
      if (workingReplacements.hb[0] === termReplace.replacement.hb) return
      updateTermReplaceReplacement('en', workingReplacements.hb[0])
    },
    500,
    [workingReplacements.hb, termReplace.replacement.hb, updateTermReplaceReplacement]
  )

  return (
    <>
      <Box
        bg={bg}
        ref={boxRef}
        position="fixed"
        right="0"
        top="400px"
        display="flex"
        flexDirection="column"
      >
        <ExpandingMenuButton
          colorScheme={termReplace.enable ? 'yellow' : 'gray'}
          isHovering={isHovering}
          onClick={() => {
            return isOpen ? onClose() : onOpen()
          }}
        >
          <Box marginLeft="12px" marginRight="12px" as={VscReplace} />
          Term Replacement
        </ExpandingMenuButton>
      </Box>
      <Modal onClose={onClose} size="full" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent marginTop={0}>
          <ModalHeader>Term Replacement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Container>
              <Text mb={8}>
                Everyone has a different concept of the divine. With this utility you can specify a
                word or series of words you encounter in the text, and we'll automatically replace
                them with your desired replacement term. Please note: this will not affect
                surrounding grammar, only the targeted word itself.
              </Text>
              <FormControl display="flex" alignItems="center" mb={8}>
                <FormLabel htmlFor="enableTermReplacement" mb="0">
                  Enable term replacement?
                </FormLabel>
                <Switch
                  id="enableTermReplacement"
                  isChecked={termReplace.enable}
                  onChange={(e) => toggleTermReplace()}
                />
              </FormControl>
              {types.map((t) => (
                <Box width="100%" display="flex" flexDirection="row" mb={8}>
                  <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    height="100%"
                    mr={4}
                  >
                    <Text mb="8px">
                      {t.name[0].toUpperCase()}
                      {t.name.substring(1)} target words (comma separated):
                    </Text>
                    <Textarea
                      value={workingTargets[t.code][0] || termReplace.target[t.code].join(',')}
                      onChange={(e) => workingTargets[t.code][1](e.target.value)}
                      placeholder="god, lord, adonai"
                      size="sm"
                    />
                  </Box>
                  <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    minHeight="100%"
                    ml={4}
                  >
                    <Text mb="8px">Replacement term:</Text>
                    <Textarea
                      value={workingReplacements[t.code][0] || termReplace.replacement[t.code]}
                      onChange={(e) => workingReplacements[t.code][1](e.target.value)}
                      placeholder="community"
                      size="sm"
                    />
                  </Box>
                </Box>
              ))}
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
