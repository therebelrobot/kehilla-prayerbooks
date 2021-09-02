import React from 'react'

import NoSSR from 'react-no-ssr'

import {Box, useColorMode} from '@chakra-ui/react'
import {css, Global} from '@emotion/react'

import {FilterMenu} from '_/components/FilterMenu'
import {ReadingsMenu} from '_/components/ReadingsMenu'
import {SearchMenu} from '_/components/SearchMenu'
import {SettingsMenu} from '_/components/SettingsMenu'

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
          .chakra-ui-dark .react-simple-keyboard {
            background-color: rgba(255, 255, 255, 0.2);
          }
          .chakra-ui-dark .react-simple-keyboard .hg-button {
            background-color: rgb(26, 32, 44);
          }
          .hg-button-bksp span,
          .hg-button-tab span,
          .hg-button-lock span,
          .hg-button-enter span,
          .hg-button-shift span {
            font-size: 1rem;
          }
          [data-skbtnuid='default-r0b11'] {
            width: 30px !important;
          }
        `}
      />
      <Box position="fixed" top={0} left={0} w="100vw" h="100vh" overflow="auto">
        <NoSSR>
          <SettingsMenu />
          <FilterMenu />
          <ReadingsMenu />
          <SearchMenu />
        </NoSSR>
        {children}
      </Box>
    </>
  )
}
