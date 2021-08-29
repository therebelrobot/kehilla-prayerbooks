import React from 'react'

import {FaRegCopy, FaRegPauseCircle, FaRegStopCircle} from 'react-icons/fa'

import {
    Box, Button, ButtonGroup, Code, useClipboard, useColorModeValue, useToast
} from '@chakra-ui/react'

import {useFollowReading, useRemoveStartedSession} from '_/services/Api/queries'
import {useReadingSession} from '_/services/state'

export const StartedSessionBar = () => {
  const {
    startedSessionId,
    sessionPaused,
    setSessionPaused,
    updateStartedSessionId,
    setMatchingSnippet,
  } = useReadingSession()
  const bg = useColorModeValue('white', 'gray.800')

  const {removeStartedSession} = useRemoveStartedSession()

  const {connectedCount} = useFollowReading(startedSessionId)

  const toast = useToast()
  const {hasCopied, onCopy} = useClipboard(startedSessionId)

  return (
    <Box
      bg={bg}
      boxShadow="0 0 5px rgba(0,0,0,0.5)"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-between"
      alignItems="center"
      position="fixed"
      bottom="0"
      left="0"
      width="100vw"
      borderTopWidth="1px"
      fontFamily="sans-serif"
    >
      <Box
        height="64px"
        px="16px"
        borderRightWidth="1px"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
      >
        You are currently running reading session{' '}
        <Code
          ml="4px"
          cursor="pointer"
          colorScheme="purple"
          children={
            <Box display="flex" flexDirection="row" alignItems="center">
              {startedSessionId} <Box ml="4px" as={FaRegCopy} />
            </Box>
          }
          onClick={(...args) => {
            onCopy(...args)
            toast({
              title: 'Copied Session ID',
              description: `Your ReadAlong session ID, ${startedSessionId}, was copied to your clipboard.`,
              status: 'info',
              duration: 9000,
              isClosable: true,
            })
          }}
        />
      </Box>
      <Box
        height="64px"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        flexWrap="nowrap"
        whiteSpace="pre"
        wordWrap="nowrap"
        flexGrow={1}
        px="16px"
      >
        {connectedCount} {connectedCount === 1 ? 'person' : 'people'} connected
      </Box>
      <Box
        height="64px"
        px="16px"
        borderLeftWidth="1px"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
      >
        <ButtonGroup isAttached>
          <Button onClick={() => setSessionPaused(!sessionPaused)}>
            <Box as={FaRegPauseCircle} mr="8px" />
            {sessionPaused ? 'Resume' : 'Pause'} Session
          </Button>
          <Button
            onClick={() => {
              removeStartedSession({variables: {sessionId: startedSessionId}}).then(() => {
                toast({
                  title: 'ReadAlong Ended',
                  description: `Session ${startedSessionId} was successfully ended`,
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                })
                setMatchingSnippet(null)
                updateStartedSessionId(null)
              })
            }}
          >
            <Box as={FaRegStopCircle} mr="8px" />
            {startedSessionId ? 'End Session' : 'Disconnect'}
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  )
}
