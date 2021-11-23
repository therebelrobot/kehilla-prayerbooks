import {useQuery as useQueryRaw} from '@apollo/client'
import {useAuth0} from '@auth0/auth0-react'
import {localStorage} from '_/utils/localStorage'

export const useQuery = (query, ...rest) => {
  const {logout} = useAuth0()
  const results = useQueryRaw(query, ...rest)
  if (
    results.error &&
    results.error?.graphQLErrors &&
    results.error.graphQLErrors[0] &&
    results.error.graphQLErrors[0].message &&
    results.error.graphQLErrors[0].message.includes('JWTExpired')
  ) {
    console.error('JWTExpired')
    localStorage().removeItem('auth_token')
    logout({returnTo: window.location.origin})
  }
  return results
}
