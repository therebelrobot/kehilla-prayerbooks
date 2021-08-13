import React, {FC} from 'react'

import {MdClose, MdExitToApp, MdPerson} from 'react-icons/md'

import {useAuth0} from '@auth0/auth0-react'
import {Avatar, IconButton, Spinner} from '@chakra-ui/react'

import {useReload} from '_/services/state'

interface LoginButtonProps {}

export const LoginButton: FC<LoginButtonProps> = ({}) => {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0()
  const {forceReload} = useReload()
  console.log({user})

  React.useEffect(() => {
    if (!isAuthenticated) return
    ;(async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: 'https://prayerbooks.auth/',
        })
        localStorage.setItem('auth_token', token)
        forceReload()
      } catch (e) {
        console.error(e)
      }
    })()
  }, [getAccessTokenSilently, isAuthenticated])

  const fullLogout = () => {
    localStorage.removeItem('auth_token')
    return logout({returnTo: window.location.origin})
  }

  return (
    <IconButton
      aria-label="Toggle Theme Mode"
      icon={
        isLoading ? (
          <Spinner size="sm" />
        ) : error ? (
          <MdClose />
        ) : isAuthenticated ? (
          user ? (
            <Avatar name={user.name} src={user.picture} size="sm" />
          ) : (
            <MdExitToApp />
          )
        ) : (
          <MdPerson />
        )
      }
      onClick={() => (isAuthenticated ? fullLogout() : loginWithRedirect())}
    />
  )
}
