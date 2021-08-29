import React, {useRef} from 'react'

import {FaRegMoon} from 'react-icons/fa'
import {FiSun} from 'react-icons/fi'
import {useHoverDirty} from 'react-use'

import {Box, Button, useColorMode, useColorModeValue} from '@chakra-ui/react'

import {LoginButton} from '_/components/LoginButton'

const bgColor = {light: 'white', dark: 'rgb(26, 32, 44)'}

export const SettingsMenu = () => {
  const boxRef = useRef(null)
  const isHovering = useHoverDirty(boxRef)
  const {colorMode, toggleColorMode} = useColorMode()
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <>
      <Box
        bg={bg}
        ref={boxRef}
        position="fixed"
        right="0"
        top="32px"
        display="flex"
        flexDirection="column"
      >
        <Box>
          <Button
            transition="width 0.3s ease"
            width={!isHovering ? '32px' : '225px'}
            overflow="hidden"
            textAlign="left"
            position="relative"
            borderRadius={0}
            onClick={() => toggleColorMode()}
            colorScheme="gray"
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
                as={colorMode === 'dark' ? FiSun : FaRegMoon}
                marginLeft="12px"
                marginRight="12px"
              />
              Switch to {colorMode === 'dark' ? 'Light' : 'Dark'} Mode
            </Box>
          </Button>
        </Box>
        <Box boxSize="8px" />
        <LoginButton isHovering={isHovering} />
      </Box>
    </>
  )
}
