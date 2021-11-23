import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {UPDATE_STARTED_SESSION_MUTATION} from './UPDATE_STARTED_SESSION_MUTATION'

export const useUpdateStartedSession = () => {
  const [updateStartedSession, {data, loading, error}] = useMutation(
    UPDATE_STARTED_SESSION_MUTATION,
    {
      ...contextIfTokenPresent(),
    }
  )
  return {updateStartedSession, data, loading, error}
}
