import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {INSERT_CONNECTED_READER_MUTATION} from './INSERT_CONNECTED_READER_MUTATION'

export const useInsertConnectedReader = () => {
  const [insertConnectedReader, {data, loading, error}] = useMutation(
    INSERT_CONNECTED_READER_MUTATION,
    {
      ...contextIfTokenPresent(),
    }
  )
  return {insertConnectedReader, data, loading, error}
}
