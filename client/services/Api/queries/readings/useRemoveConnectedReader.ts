import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {REMOVE_CONNECTED_READER_MUTATION} from './REMOVE_CONNECTED_READER_MUTATION'

export const useRemoveConnectedReader = () => {
  const [removeConnectedReader, {data, loading, error}] = useMutation(
    REMOVE_CONNECTED_READER_MUTATION,
    {
      ...contextIfTokenPresent(),
    }
  )
  return {removeConnectedReader, data, loading, error}
}
