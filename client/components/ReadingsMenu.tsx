import React, {useRef} from 'react'

import {FaBookReader} from 'react-icons/fa'
import {RiLoginBoxFill} from 'react-icons/ri'
import {useHoverDirty} from 'react-use'
import {JoinReadingsModal} from './JoinReadingsModal'
import {StartedSessionBar} from './StartedSessionBar'
import {StartReadingsModal} from './StartReadingsModal'

import {useAuth0} from '@auth0/auth0-react'
import {Box, Button, useColorModeValue, useDisclosure} from '@chakra-ui/react'

import {JoinedSessionBar} from '_/components/JoinedSessionBar'
import {useReadingSession} from '_/services/state'

export const ReadingsMenu = () => {
  const {isAuthenticated} = useAuth0()

  const {startedSessionId, joinedSessionId} = useReadingSession()

  const boxRef = useRef(null)
  const isHovering = useHoverDirty(boxRef)
  const bg = useColorModeValue('white', 'gray.800')
  const {isOpen: isOpenStart, onOpen: onOpenStart, onClose: onCloseStart} = useDisclosure()
  const {isOpen: isOpenJoin, onOpen: onOpenJoin, onClose: onCloseJoin} = useDisclosure()

  return (
    <>
      <Box
        bg={bg}
        ref={boxRef}
        position="fixed"
        left="0"
        top="32px"
        display="flex"
        flexDirection="column"
      >
        {isAuthenticated && (
          <>
            <Box>
              <Button
                transition="width 0.3s ease"
                width={!isHovering ? '32px' : '240px'}
                overflow="hidden"
                textAlign="left"
                position="relative"
                borderRadius={0}
                onClick={onOpenStart}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  position="absolute"
                  left={0}
                  top="50%"
                  transform="translateY( -50% )"
                >
                  <Box as={FaBookReader} marginLeft="12px" marginRight="12px" />
                  Start a ReadAlong session
                </Box>
              </Button>
            </Box>
            <Box boxSize="8px" />
          </>
        )}
        <Box>
          <Button
            transition="width 0.3s ease"
            width={!isHovering ? '32px' : '240px'}
            overflow="hidden"
            textAlign="left"
            position="relative"
            borderRadius={0}
            onClick={onOpenJoin}
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              position="absolute"
              left={0}
              top="50%"
              transform="translateY( -50% )"
            >
              <Box as={RiLoginBoxFill} marginLeft="12px" marginRight="12px" />
              Join a ReadAlong session
            </Box>
          </Button>
        </Box>
        <Box></Box>
      </Box>
      <StartReadingsModal isOpen={isOpenStart} onClose={onCloseStart} />
      <JoinReadingsModal isOpen={isOpenJoin} onClose={onCloseJoin} />
      {startedSessionId && <StartedSessionBar />}
      {joinedSessionId && !startedSessionId && <JoinedSessionBar />}
    </>
  )
}
