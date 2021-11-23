import {useAuth0} from '@auth0/auth0-react'
import {load as fpLoad} from '@fingerprintjs/fingerprintjs'
import {useRouter} from 'next/router'
import * as React from 'react'
import {ReadingLayout} from '_/layouts/ReadingLayout'
import {useLazyGetConnectedReaderById} from '_/services/Api/queries/readings/useLazyGetConnectedReaderById'
import {useLazyGetSessionByUserId} from '_/services/Api/queries/readings/useLazyGetSessionByUserId'
import {useUpdateStartedSession} from '_/services/Api/queries/readings/useUpdateStartedSession'
import {useReadingSession} from '_/services/state'

export const ReadingHandler = () => {
  // home page data needs are handled here
  // do not put layout JSX in here, only Provider wrapping if needed

  const router = useRouter()
  const {query} = router
  const {bookPath = []} = query
  const [book, section, prayer, line] = bookPath as string[]
  console.log(book, section)
  const {updateStartedSession} = useUpdateStartedSession()
  const {
    startedSessionId,
    setMatchingSnippet,
    readerId,
    setReaderId,
    updateStartedSessionId,
    updateJoinedSessionId,
  } = useReadingSession()
  const {getConnectedReaderById} = useLazyGetConnectedReaderById({
    onCompleted: (data) => {
      console.log('getConnectedReaderById onCompleted', {data})
      if (data?.connected_readers?.length) {
        updateJoinedSessionId(data.connected_readers[0].session_id)
      }
    },
  })
  const {user, getIdTokenClaims} = useAuth0()
  const [userId, setUserId] = React.useState('')

  const {getSessionByUserId} = useLazyGetSessionByUserId({
    onCompleted: (data) => {
      console.log('get session getSessionByUserId onCompleted', {data})
      if (data?.readings?.length) {
        updateStartedSessionId(data.readings[0].session_id)
      }
    },
  })

  React.useEffect(() => {
    console.log('get session useEffect 1', userId)
    if (userId.length) return
    getIdTokenClaims().then((data) => {
      if (!data) return
      console.log('get session useEffect getIdTokenClaims', data)
      getSessionByUserId({variables: {user_id: data.sub}})
      setUserId(data.sub)
    }),
      [getIdTokenClaims, getSessionByUserId, setUserId, userId]
  })

  React.useEffect(() => {
    console.log('startedSessionId useEffect', startedSessionId)
    if (!startedSessionId) return
    updateStartedSession({
      variables: {sessionId: startedSessionId, _set: {current_url: window.location.pathname}},
    })
    setMatchingSnippet(null)
  }, [startedSessionId, updateStartedSession, book, section, prayer, line])

  React.useEffect(() => {
    if (readerId) return
    fpLoad()
      .then((fp) => fp.get())
      .then(({visitorId}) => {
        setReaderId(visitorId)
      })
  }, [book, section, prayer, line])

  React.useEffect(() => {
    // check if reading session is active
    getConnectedReaderById({
      variables: {reader_id: readerId},
    })
  }, [readerId])

  return React.createElement(ReadingLayout, {book, section, prayer, line})
}
