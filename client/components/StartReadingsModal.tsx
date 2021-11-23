import {useAuth0} from '@auth0/auth0-react'
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useClipboard,
  useToast,
} from '@chakra-ui/react'
import React, {useEffect, useState} from 'react'
import random from 'simple-random'
import {useCreateReading} from '_/services/Api/queries/readings/useCreateReading'
import {useReadingSession} from '_/services/state'
import {KEYBOARD_CHARS} from './KEYBOARD_CHARS'

export const StartReadingsModal = ({isOpen, onClose}) => {
  const {user, getIdTokenClaims} = useAuth0()
  const [userId, setUserId] = useState('')
  console.log({user})
  const {updateStartedSessionId} = useReadingSession()
  const {createReading, loading, err0r} = useCreateReading(userId)

  const newSessionId = random({length: 5, chars: KEYBOARD_CHARS})

  const toast = useToast()
  const {hasCopied, onCopy} = useClipboard(newSessionId)

  useEffect(() => {
    if (userId.length) return
    getIdTokenClaims().then((data) => {
      if (!data) return
      console.log('getIdTokenClaims', data)
      setUserId(data.sub)
    }),
      [getIdTokenClaims, setUserId, userId]
  })
  console.log({userId})
  if (!userId.length) return null
  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ReadAlong: Start a session</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Want to start a ReadAlong session? We'll provide you a code to give to folks joining, and
          when you tap on a prayer section, we'll bring the other folks to where you are so they can
          read along.
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Box boxSize="8px" />

          <Button
            colorScheme="green"
            onClick={(...args) => {
              onCopy(...args)
              console.log({newSessionId})
              createReading({
                variables: {
                  session_id: newSessionId,
                  current_url: window.location.pathname,
                },
              })
                .then(() => {
                  toast({
                    title: 'Copied Session ID',
                    description: `Your ReadAlong session ID, ${newSessionId}, was copied to your clipboard.`,
                    status: 'info',
                    duration: 9000,
                    isClosable: true,
                  })
                  updateStartedSessionId(newSessionId)
                  onClose()
                })
                .catch((e) => {
                  console.error(e)
                })
              // removeLine().then(updatePrayerCb).then(onClose)
            }}
          >
            Let's get started!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
