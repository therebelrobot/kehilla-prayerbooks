import React, {FC} from 'react'

import Link from 'next/link'
import {useRouter} from 'next/router'
import {
    MdChromeReaderMode, MdClose, MdExitToApp, MdModeEdit, MdPerson
} from 'react-icons/md'

import {useAuth0} from '@auth0/auth0-react'
import {Avatar, Badge, Box, IconButton, Spinner} from '@chakra-ui/react'

import {useReload} from '_/services/state'

interface LoginButtonProps {}

const roleColors = {
  Admin: 'red',
  Editor: 'orange',
}

const RoleTag = ({role}) => {
  return (
    <Badge
      variant="subtle"
      colorScheme={roleColors[role]}
      position="fixed"
      right="32px"
      top="0px"
      fontFamily="Arial"
    >
      {role}
    </Badge>
  )
}

export const LoginButton: FC<LoginButtonProps> = ({}) => {
  const router = useRouter()
  const isEdit = router.asPath.includes('editing')
  const path = window.location.pathname
  console.log({path})
  console.log({router})
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
  const [roles, setRoles] = React.useState([])

  React.useEffect(() => {
    if (!isAuthenticated) return

    const profileRoles = user['https://prayerbooks.h4x.sh/roles']
    setRoles(profileRoles)
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
    <>
      {!!roles.length && (
        <>
          {roles.includes('Admin') ? (
            <RoleTag role="Admin" />
          ) : roles.includes('Editor') ? (
            <RoleTag role="Editor" />
          ) : null}
        </>
      )}
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
      {(roles.includes('Admin') || roles.includes('Editor')) && (
        <>
          <Box boxSize="8px" />
          <Link
            href={isEdit ? path.replace('editing', 'reading') : path.replace('reading', 'editing')}
          >
            <IconButton
              aria-label="Toggle Theme Mode"
              icon={isEdit ? <MdChromeReaderMode /> : <MdModeEdit />}
            />
          </Link>
        </>
      )}
    </>
  )
}
