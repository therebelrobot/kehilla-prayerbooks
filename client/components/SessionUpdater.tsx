import React, {useEffect, useRef, useState} from 'react'

import {Box} from '@chakra-ui/layout'

import {useUpdateStartedSession} from '_/services/Api/queries'
import {useReadingSession} from '_/services/state'

export const SessionUpdater = ({type, id, children, ...props}) => {
  const thisId = `${type}-${id}`
  const thisSnippet = useRef(null)
  const [isMatching, setIsMatching] = useState(false)

  const {updateStartedSession} = useUpdateStartedSession()
  const {startedSessionId, joinedSessionId, sessionPaused, matchingSnippet, setMatchingSnippet} =
    useReadingSession()

  useEffect(() => {
    console.log('sessionupdater', matchingSnippet, thisId)
    if (!joinedSessionId) return
    if (!matchingSnippet || sessionPaused || matchingSnippet !== thisId) return setIsMatching(false)
    if (isMatching) return
    console.log('made it through!')

    setIsMatching(true)
    thisSnippet.current.scrollIntoView(true, {block: 'center', behavior: 'smooth'})
  }, [matchingSnippet, setIsMatching, isMatching, thisId, joinedSessionId, sessionPaused])
  useEffect(() => {
    if (!startedSessionId) return
    if (!matchingSnippet || sessionPaused || matchingSnippet !== thisId) return setIsMatching(false)
    if (isMatching) return
    console.log('made it through!')
    setIsMatching(true)
  }, [matchingSnippet, isMatching, setIsMatching, startedSessionId, thisId, sessionPaused])

  return (
    <Box
      {...props}
      ref={thisSnippet}
      px="4px"
      borderRadius="4px"
      bg={isMatching ? 'rgba(214,158,46,0.35)' : 'transparent'}
      transition="background-color .2s linear"
      cursor={startedSessionId ? 'pointer' : undefined}
      onClick={() => {
        if (!startedSessionId || sessionPaused) return
        setMatchingSnippet(thisId)
        setIsMatching(true)
        updateStartedSession({
          variables: {sessionId: startedSessionId, _set: {current_location_id: thisId}},
        })
      }}
    >
      {children}
    </Box>
  )
}
