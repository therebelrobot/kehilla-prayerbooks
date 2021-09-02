import React, {useRef} from 'react'

import {useRouter} from 'next/router'
import {useHoverDirty} from 'react-use'
import {ExpandingMenuButton} from './ExpandingMenuButton'

import {Box, useColorModeValue} from '@chakra-ui/react'
import {RiEnglishInput, RiTranslate} from '@hacknug/react-icons/ri'

import {useFilters} from '_/services/state'

const bgColor = {light: 'white', dark: 'rgb(26, 32, 44)'}

export const FilterMenu = () => {
  const boxRef = useRef(null)
  const isHovering = useHoverDirty(boxRef)
  const bg = useColorModeValue('white', 'gray.800')
  const {showHebrew, showTrans, showEng, toggleShowHebrew, toggleShowTrans, toggleShowEng} =
    useFilters()

  const router = useRouter()
  const {query} = router
  const {bookPath = []} = query
  const [_, __, prayerSlug] = bookPath as string[]

  if (!prayerSlug) return null

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
