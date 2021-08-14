import * as React from 'react'

import {ReadingLayout} from '_/layouts/ReadingLayout'

export const ReadingHandler = () => {
  // home page data needs are handled here
  // do not put layout JSX in here, only Provider wrapping if needed

  return React.createElement(ReadingLayout, {})
}
