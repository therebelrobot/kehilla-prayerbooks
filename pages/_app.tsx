import React from 'react'
import NoSSR from 'react-no-ssr'
import 'react-simple-keyboard/build/css/index.css'
// eslint-disable-next-line import/extensions
import '_/components/TipTapStyles.scss'
import {AppHandler} from '_/handlers/AppHandler'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const App = (props) => {
  return (
    <NoSSR>
      <AppHandler {...props} />
    </NoSSR>
  )
}
export default App
