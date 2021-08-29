import React, {FC} from 'react'

import Link from 'next/link'
import {useRouter} from 'next/router'
import {
    MdChromeReaderMode, MdClose, MdExitToApp, MdModeEdit, MdPerson
} from 'react-icons/md'

import {useAuth0} from '@auth0/auth0-react'
import {Avatar, Badge, Box, Button, Spinner} from '@chakra-ui/react'

import {useReload} from '_/services/state'

interface LoginButtonProps {
  isHovering: boolean
}

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

export const LoginButton: FC<LoginButtonProps> = ({isHovering}) => {
  const router = useRouter()
  const isEdit = router.asPath.includes('editing')
  const path = window.location.pathname
  // console.log({path})
  // console.log({router})
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
  // console.log({user})
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
      <Button
        transition="width 0.3s ease"
        width={!isHovering ? '32px' : '225px'}
        overflow="hidden"
        textAlign="left"
        position="relative"
        borderRadius={0}
        colorScheme="gray"
        onClick={() => (isAuthenticated ? fullLogout() : loginWithRedirect())}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          position="absolute"
          left={0}
          top="50%"
          transform="translateY( -50% )"
        >
          <Box
            as={
              isLoading
                ? (props) => <Spinner {...props} size="sm" />
                : error
                ? MdClose
                : !isAuthenticated
                ? MdPerson
                : !user
                ? MdExitToApp
                : (props) => (
                    <Avatar
                      {...props}
                      marginLeft="8px !important"
                      name={user.name}
                      src={user.picture}
                      size="xs"
                    />
                  )
            }
            marginLeft="12px"
            marginRight="12px"
          />
          {isLoading
            ? 'Logging in...'
            : error
            ? 'Error logging in'
            : !isAuthenticated
            ? 'Log in'
            : !user
            ? 'Log out'
            : `${user.name} (Log out)`}
        </Box>
      </Button>

      {(roles.includes('Admin') || roles.includes('Editor')) && (
        <>
          <Box boxSize="8px" />
          <Box>
            <Link
              href={
                isEdit ? path.replace('editing', 'reading') : path.replace('reading', 'editing')
              }
            >
              <Button
                transition="width 0.3s ease"
                width={!isHovering ? '32px' : '225px'}
                overflow="hidden"
                textAlign="left"
                position="relative"
                colorScheme="gray"
                borderRadius={0}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  position="absolute"
                  left={0}
                  top="50%"
                  transform="translateY( -50% )"
                >
                  <Box
                    as={isEdit ? MdChromeReaderMode : MdModeEdit}
                    marginLeft="12px"
                    marginRight="12px"
                  />
                  {isEdit ? 'Return to reader mode' : 'Go to edit mode'}
                </Box>
              </Button>
            </Link>
          </Box>
        </>
      )}
    </>
  )
}
