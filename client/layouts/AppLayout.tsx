import React from 'react'

import NoSSR from 'react-no-ssr'

import {Box, useColorMode} from '@chakra-ui/react'
import {css, Global} from '@emotion/react'

import {ReadingsMenu} from '_/components/ReadingsMenu'
import {SettingsMenu} from '_/components/SettingsMenu'

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
        <NoSSR>
          <SettingsMenu />
          <ReadingsMenu />
        </NoSSR>
        {children}
      </Box>
    </>
  )
}
