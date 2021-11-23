import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {REMOVE_STARTED_SESSION_MUTATION} from './REMOVE_STARTED_SESSION_MUTATION'

export const useRemoveStartedSession = () => {
  const [removeStartedSession, {data, loading, error}] = useMutation(
    REMOVE_STARTED_SESSION_MUTATION,
    {
      ...contextIfTokenPresent(),
    }
  )
  return {removeStartedSession, data, loading, error}
}
