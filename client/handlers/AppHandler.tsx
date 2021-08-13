import React from 'react'

import {ChakraProvider, CSSReset} from '@chakra-ui/react'

import {AppLayout} from '_/layouts/AppLayout'
import {ApiProvider} from '_/services/Api/ApiProvider'

export const AppHandler = ({Component, pageProps}) => {
  // do not put layout JSX in here, only Provider wrapping if needed

  return (
    <ApiProvider initialState={pageProps.initialApolloState}>
      <ChakraProvider>
        <CSSReset />
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ChakraProvider>
    </ApiProvider>
  )
}
