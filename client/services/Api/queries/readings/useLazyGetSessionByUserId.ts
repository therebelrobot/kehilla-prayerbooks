import {useLazyQuery} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {GET_SESSION_BY_USER_ID_QUERY} from './GET_SESSION_BY_USER_ID_QUERY'

export const useLazyGetSessionByUserId = (opts = {}) => {
  const [getSessionByUserId, {data, loading, error}] = useLazyQuery(GET_SESSION_BY_USER_ID_QUERY, {
    ...contextIfTokenPresent(),
    ...opts,
  })
  return {getSessionByUserId, data, loading, error}
}
