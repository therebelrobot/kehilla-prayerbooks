import React, {useEffect, useRef, useState} from 'react'

import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'

import {Input, InputGroup, InputLeftAddon} from '@chakra-ui/react'

const layout = {
  default: [
    '1 2 3 4 5 6 7 8 9 0 - \u05c1 {bksp}',
    "{tab} / ' \u05e7 \u05e8 \u05d0 \u05d8 \u05d5 \u05df \u05dd \u05e4 \u05c2 \u05c3",
    '{lock} \u05e9 \u05d3 \u05d2 \u05db \u05e2 \u05d9 \u05d7 \u05dc \u05da \u05e3 , {enter}',
    '{shift} \u05d6 \u05e1 \u05d1 \u05d4 \u05e0 \u05de \u05e6 \u05ea \u05e5 . \u05c6 \u05c5 {shift}',
    '{space}',
  ],
  shift: [
    '\u0591 \u0592 \u0593 \u0594 \u0595 \u0596 \u0597 \u0598 \u0599 \u059a \u059b \u059c \u059d {bksp}',
    '{tab} \u059e \u059f \u05a0 \u05a1 \u05a2 \u05a3 \u05a4 \u05a5 \u05a6 \u05a7 \u05a8 \u05a9 \u05aa',
    '{lock} \u05ab \u05ac \u05ad \u05ae \u05af \u05b0 \u05b1 \u05b2 \u05b3 \u05b4 \u05b5 {enter}',
    '{shift} \u05b6 \u05b7 \u05b8 \u05b9 \u05ba \u05bb \u05bc \u05bd \u05be \u05bf \u05c0 {shift}',
    '\u05c4 \u05c7 {space}',
  ],
}

export const HebrewInput = ({field = {}, onChange, id, setValue}) => {
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [toggle, setToggle] = useState(false)
  const keyboard = useRef()
  const [layoutKeys, setLayoutKeys] = useState('default')

  const onChangeKeyboard = (input) => {
    setValue(input)
    console.log('Input changed', input)
  }

  const handleShift = () => {
    const newLayoutName = layoutKeys === 'default' ? 'shift' : 'default'
    setLayoutKeys(newLayoutName)
  }

  const onKeyPress = (button) => {
    console.log('Button pressed', button)
    if (button === '{shift}' || button === '{lock}') handleShift()
  }

  const onChangeInput = (event) => {
    console.log(event)
    const input = event.target.value
    if (keyboard.current) {
      keyboard.current.setInput(input)
    }
    onChange(event)
  }

  useEffect(() => {
    console.log('useEffect', keyboard.current, toggle)
    if (!keyboard.current) return
    const keyboardValue = keyboard.current.getInput()
    const fieldValue = field.value
    console.log({keyboardValue, fieldValue})
    if (fieldValue !== keyboardValue) {
      keyboard.current.setInput(fieldValue)
    }
  }, [keyboard.current, field.value, toggle])

  return (
    <div className="hebrew">
      <InputGroup>
        <InputLeftAddon
          cursor="pointer"
          onClick={() => setShowKeyboard(!showKeyboard)}
          children={showKeyboard ? 'Close keyboard' : 'Open keyboard'}
        />
        <Input
          {...field}
          id={id}
          name={id}
          placeholder={'Hebrew'}
          onChange={onChangeInput}
          style={{direction: 'rtl'}}
          fontSize="25px"
        />
      </InputGroup>

      {showKeyboard && (
        <Keyboard
          key={`keyboard-${id}`}
          keyboardRef={(r) => {
            keyboard.current = r
            setToggle(!toggle)
          }}
          layoutName={layoutKeys}
          layout={layout}
          onChange={onChangeKeyboard}
          onKeyPress={onKeyPress}
        />
      )}
    </div>
  )
}
