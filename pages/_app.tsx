import NoSSR from 'react-no-ssr'
import 'react-simple-keyboard/build/css/index.css'

// eslint-disable-next-line import/extensions
import '_/components/TipTapStyles.scss'
import {AppHandler} from '_/handlers/AppHandler'

export default (props) => {
  return (
    <NoSSR>
      <AppHandler {...props} />
    </NoSSR>
  )
}
