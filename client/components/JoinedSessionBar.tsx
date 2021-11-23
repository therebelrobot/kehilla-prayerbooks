import {Box, Button, ButtonGroup, useColorModeValue, useToast} from '@chakra-ui/react'
import {load as fpLoad} from '@fingerprintjs/fingerprintjs'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {FaRegPauseCircle, FaRegStopCircle} from 'react-icons/fa'
import {useFollowReading} from '_/services/Api/queries/readings/useFollowReading'
import {useInsertConnectedReader} from '_/services/Api/queries/readings/useInsertConnectedReader'
import {useRemoveConnectedReader} from '_/services/Api/queries/readings/useRemoveConnectedReader'
import {useReadingSession} from '_/services/state'

export const JoinedSessionBar = () => {
  const {
    joinedSessionId,
    sessionPaused,
    setSessionPaused,
    updateJoinedSessionId,
    setMatchingSnippet,
    readerId,
  } = useReadingSession()
  const bg = useColorModeValue('white', 'gray.800')
  const router = useRouter()
  const [afterFirst, setAfterFirst] = useState(false)

  const {insertConnectedReader} = useInsertConnectedReader()
  const {removeConnectedReader} = useRemoveConnectedReader()

  const toast = useToast()

  const {data, loading, error, currentUrl, currentLocationId, connectedCount} = useFollowReading(
    joinedSessionId,
    {
      onSubscriptionData: ({subscriptionData}) => {
        console.log('joinedSessionId onSubscriptionData', data)
        if (!subscriptionData.data.readings.length) {
          toast({
            title: 'ReadAlong Ended',
            description: `ReadAlong session ${joinedSessionId} was ended by the owner.`,
            status: 'info',
            duration: 9000,
            isClosable: true,
          })
          return updateJoinedSessionId(null)
        }
        if (!afterFirst) {
          insertConnectedReader({
            variables: {session_id: joinedSessionId, reader_id: readerId},
          }).then(() => {
            setAfterFirst(true)
          })
        }
      },
    }
  )

  useEffect(() => {
    setMatchingSnippet(currentLocationId || null)
    if (!currentUrl) return
    const path = window.location.pathname
    if (path !== currentUrl) {
      console.log({currentUrl})
      setMatchingSnippet(null)
      router.push(currentUrl)
    }
  }, [setMatchingSnippet, currentLocationId, currentUrl])
  console.log({data})

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
        You are currently reading along with session {joinedSessionId}
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
        px="16px"
        flexGrow={1}
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
              setMatchingSnippet(null)
              fpLoad()
                .then((fp) => fp.get())
                .then((result) => {
                  // This is the visitor identifier:
                  const visitorId = result.visitorId
                  console.log(visitorId)
                  return removeConnectedReader({
                    variables: {reader_id: visitorId},
                  })
                })
                .then(() => {
                  updateJoinedSessionId(null)
                })
            }}
          >
            <Box as={FaRegStopCircle} mr="8px" />
            Disconnect
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  )
}
