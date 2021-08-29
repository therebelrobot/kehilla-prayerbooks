import React, {useState} from 'react'

import {
    Button, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay
} from '@chakra-ui/react'

import {useReadingSession} from '_/services/state'

export const JoinReadingsModal = ({isOpen, onClose}) => {
  const [sessionId, setSessionId] = useState('')
  const {updateJoinedSessionId} = useReadingSession()
  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ReadAlong: Join a session</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Want to join a ReadAlong session? The person starting the session should give you a code
          to input here, and when they tap on a prayer section, we'll bring you to where they are so
          you can read along.
        </ModalBody>
        <ModalFooter display="flex" flexDirection="row" justifyContent="space-evenly">
          <InputGroup width="200px">
            <Input
              value={sessionId.toUpperCase()}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="CODE"
              borderRightRadius={0}
            />
            <Button
              colorScheme="green"
              ml="-px"
              borderLeftRadius={0}
              onClick={() => {
                console.log({sessionId})
                updateJoinedSessionId(sessionId.toUpperCase())
                onClose()
              }}
            >
              Connect
            </Button>
          </InputGroup>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
