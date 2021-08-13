import * as React from 'react'

import {HomeLayout} from '_/layouts/HomeLayout'

export const HomeHandler = () => {
  // home page data needs are handled here
  // do not put layout JSX in here, only Provider wrapping if needed

  return React.createElement(HomeLayout, {})
}
