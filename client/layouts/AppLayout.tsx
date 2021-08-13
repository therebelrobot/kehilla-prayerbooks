import React from 'react'

import NoSSR from 'react-no-ssr'

import {MoonIcon, SunIcon} from '@chakra-ui/icons'
import {Box, Flex, IconButton, useColorMode} from '@chakra-ui/react'
import {css, Global} from '@emotion/react'

import {LoginButton} from '_/components/LoginButton'

const bgColor = {light: 'white', dark: 'rgb(26, 32, 44)'}

export const AppLayout = ({children}) => {
  // Do not put state handling here (Graphql, useState, etc.)
  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <>
      <Global
        styles={css`
          html,
          .colortransition {
            transition: background-color 0.2s linear, color 0.2s linear, border-color 0.2s linear,
              fill 0.2s linear;
          }
        `}
      />
      <Box position="fixed" top={0} left={0} w="100vw" h="100vh" overflow="auto">
        <Flex position="fixed" right={8} top={8} direction="column">
          <IconButton
            aria-label="Toggle Theme Mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={() => toggleColorMode()}
          >
            {colorMode}
          </IconButton>
          <Box width="8px" height="8px" />
          <NoSSR>
            <LoginButton />
          </NoSSR>
        </Flex>
        {children}
      </Box>
    </>
  )
}
