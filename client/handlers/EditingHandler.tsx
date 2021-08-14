import * as React from 'react'

import {useRouter} from 'next/router'

import {EditingLayout} from '_/layouts/EditingLayout'

export const EditingHandler = () => {
  // home page data needs are handled here
  // do not put layout JSX in here, only Provider wrapping if needed

  const router = useRouter()
  const {query} = router
  const {bookPath = []} = query
  const [book, section] = bookPath
  console.log(book, section)

  return React.createElement(EditingLayout, {})
}
