import React, {useRef} from 'react'

import {useHoverDirty} from 'react-use'

import {Box, Button, useColorMode, useColorModeValue} from '@chakra-ui/react'
import {RiEnglishInput, RiTranslate} from '@hacknug/react-icons/ri'

import {useFilters} from '_/services/state'

const bgColor = {light: 'white', dark: 'rgb(26, 32, 44)'}

const ExpandingMenuButton = ({
  colorScheme = 'gray',
  isHovering,
  onClick,
  children,
  width = '32px',
  hoverWidth = '225px',
}) => {
  return (
    <Box>
      <Button
        transition="width 0.3s ease, background-color 0.2s linear"
        width={!isHovering ? width : hoverWidth}
        overflow="hidden"
        textAlign="left"
        position="relative"
        borderRadius={0}
        onClick={onClick}
        colorScheme={colorScheme}
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
          {children}
        </Box>
      </Button>
    </Box>
  )
}

export const FilterMenu = () => {
  const boxRef = useRef(null)
  const isHovering = useHoverDirty(boxRef)
  const {colorMode, toggleColorMode} = useColorMode()
  const bg = useColorModeValue('white', 'gray.800')
  const {showHebrew, showTrans, showEng, toggleShowHebrew, toggleShowTrans, toggleShowEng} =
    useFilters()

  return (
    <>
      <Box
        bg={bg}
        ref={boxRef}
        position="fixed"
        right="0"
        top="200px"
        display="flex"
        flexDirection="column"
      >
        <ExpandingMenuButton
          colorScheme={!showHebrew ? 'red' : undefined}
          hoverWidth="265px"
          isHovering={isHovering}
          onClick={() => {
            toggleShowHebrew()
          }}
        >
          <Box marginLeft="12px" marginRight="12px" className="hebrew">
            א
          </Box>
          Turn {showHebrew ? 'off' : 'on'} Hebrew
        </ExpandingMenuButton>
        <Box boxSize="8px" />
        <ExpandingMenuButton
          colorScheme={!showTrans ? 'red' : undefined}
          hoverWidth="265px"
          isHovering={isHovering}
          onClick={() => {
            toggleShowTrans()
          }}
        >
          <Box marginLeft="12px" marginRight="12px" as={RiTranslate} />
          Turn {showTrans ? 'off' : 'on'} Transliteration
        </ExpandingMenuButton>
        <Box boxSize="8px" />
        <ExpandingMenuButton
          colorScheme={!showEng ? 'red' : undefined}
          hoverWidth="265px"
          isHovering={isHovering}
          onClick={() => {
            toggleShowEng()
          }}
        >
          <Box marginLeft="12px" marginRight="12px" as={RiEnglishInput} />
          Turn {showEng ? 'off' : 'on'} English Translations
        </ExpandingMenuButton>
      </Box>
    </>
  )
}
