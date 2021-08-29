import React, {FC, useCallback, useRef} from 'react'

import {insert} from 'ramda'
import {MdAddCircle} from 'react-icons/md'
import {useHoverDirty} from 'react-use'

import {Box, Button, ButtonGroup} from '@chakra-ui/react'

import {
    GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, GET_PRAYERS_PROSE_AND_LINES,
    useGetProseAndLines, useInsertLine, useInsertProse, useUpdatePrayer
} from '_/services/Api/queries'

interface AddNewProseOrLineProps {
  prayerSlug: string
  bookSlug: string
  sectionSlug: string
  nextIndex: number
  prayerId: number
}

const EMPTY_PROSE = {
  type: 'doc',
  content: [],
}

export const AddNewProseOrLine: FC<AddNewProseOrLineProps> = ({
  prayerSlug,
  bookSlug,
  sectionSlug,
  nextIndex,
  prayerId,
}) => {
  const boxRef = useRef(null)
  const isHovering = useHoverDirty(boxRef)

  const {insertProse} = useInsertProse(bookSlug, sectionSlug, prayerSlug)
  const {insertLine} = useInsertLine(bookSlug, sectionSlug, prayerSlug)
  const {updatePrayer} = useUpdatePrayer(prayerId, bookSlug, sectionSlug)
  const {lineProseOrder} = useGetProseAndLines(bookSlug, sectionSlug, prayerSlug)

  const updatePrayerCb = useCallback(
    (data) => {
      console.log('updatePrayerCb', {data})
      let id
      let type

      if (data.data.insert_prose) {
        id = data.data.insert_prose.returning[0].id
        type = 'prose'
      } else {
        id = data.data.insert_prayer_lines.returning[0].id
        type = 'line'
      }

      const newOrder = insert(nextIndex, `${type}-${id}`, lineProseOrder)
      console.log({newOrder})
      return updatePrayer({
        variables: {
          _set: {
            line_prose_order: newOrder,
          },
        },
        refetchQueries: [
          {query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, variables: {bookSlug, sectionSlug}},
          {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
        ],
      })
    },
    [updatePrayer, JSON.stringify(lineProseOrder), bookSlug, sectionSlug, prayerSlug]
  )

  const insertProseCb = useCallback(() => {
    const variables = {tiptap_content: EMPTY_PROSE}
    console.log({variables})
    insertProse({
      variables,
    })
      .then(updatePrayerCb)
      .catch((e) => {
        console.error(e)
      })
  }, [insertProse, updatePrayerCb])

  const insertLineCb = useCallback(() => {
    insertLine()
      .then(updatePrayerCb)
      .catch((e) => {
        console.error(e)
      })
  }, [insertLine, updatePrayerCb])
  return (
    <Box
      ref={boxRef}
      width="100%"
      height="48px"
      position="relative"
      cursor="pointer"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      marginTop="0 !important"
    >
      <Box
        width="100%"
        height="50%"
        position="absolute"
        top={isHovering ? '3px' : '1px'}
        left="0"
        borderBottomWidth={isHovering ? '6px' : '2px'}
        transition="top .3s, border-width .3s"
      />
      <Box
        opacity={isHovering ? 0 : 1}
        transition="opacity .3s"
        boxSize="24px"
        as={MdAddCircle}
        position="absolute"
        left="50%"
        top="50%"
        transform="translateX( -50% ) translateY( -50% )"
      />

      <ButtonGroup size="xs" isAttached opacity={isHovering ? 1 : 0} transition="opacity .3s">
        <Button colorScheme="green" onClick={insertProseCb}>
          Add Prose
        </Button>
        <Button colorScheme="green" ml="-px" onClick={insertLineCb}>
          Add Prayer Line
        </Button>
      </ButtonGroup>
    </Box>
  )
}
