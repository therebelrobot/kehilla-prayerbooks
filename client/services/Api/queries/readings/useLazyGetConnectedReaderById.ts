import {useLazyQuery} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_CONNECTED_READER_BY_ID_QUERY} from './GET_CONNECTED_READER_BY_ID_QUERY'

export const useLazyGetConnectedReaderById = (opts = {}) => {
  const [getConnectedReaderById, {data, loading, error}] = useLazyQuery(
    GET_CONNECTED_READER_BY_ID_QUERY,
    {
      ...contextIfTokenPresent(),
      ...opts,
    }
  )
  return {getConnectedReaderById, data, loading, error}
}
