import {Box} from '@chakra-ui/layout'
import React, {useEffect, useRef} from 'react'
import {useTermReplace} from '_/services/state'

export const TermReplaceWrapper = ({type, children, ...props}) => {
  const thisSnippet = useRef(null)

  const {termReplace, toggleTermReplace, editTermReplaceTargets, updateTermReplaceReplacement} =
    useTermReplace()

  useEffect(() => {
    if (!termReplace.enable || !thisSnippet.current) return
    console.log('TermReplaceWrapper', type, thisSnippet.current, termReplace.replacement[type])
    const range = thisSnippet.current.createTextRange()
    for (const term of termReplace.target[type]) {
      while (range.findText(term)) {
        range.pasteHTML(
          `<abbr title="Original text: ${term}">${termReplace.replacement[type]}</abbr>`
        )
      }
    }
  }, [thisSnippet.current, JSON.stringify(termReplace)])

  return (
    <Box {...props} ref={thisSnippet}>
      {children}
    </Box>
  )
}
