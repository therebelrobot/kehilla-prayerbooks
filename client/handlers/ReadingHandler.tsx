import * as React from 'react'

import {useRouter} from 'next/router'

import {ReadingLayout} from '_/layouts/ReadingLayout'

export const ReadingHandler = () => {
  // home page data needs are handled here
  // do not put layout JSX in here, only Provider wrapping if needed

  const router = useRouter()
  const {query} = router
  const {bookPath = []} = query
  const [book, section, prayer, line] = bookPath as string[]
  console.log(book, section)

  return React.createElement(ReadingLayout, {book, section, prayer, line})
}
