import {localStorage} from '_/utils/localStorage'

export const contextIfTokenPresent = () => {
  const token = localStorage().getItem('auth_token')
  if (!token) return undefined
  return {
    context: {headers: {authorization: `Bearer ${token}`}},
  }
}
