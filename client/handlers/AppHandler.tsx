import React from 'react'

import Head from 'next/head'

import {Auth0Provider} from '@auth0/auth0-react'
import {ChakraProvider, CSSReset, extendTheme} from '@chakra-ui/react'

import {AppLayout} from '_/layouts/AppLayout'
import {ApiProvider} from '_/services/Api/ApiProvider'
import {useFont, useReload} from '_/services/state'

export const AppHandler = ({Component, pageProps}) => {
  // do not put layout JSX in here, only Provider wrapping if needed
  const {reload} = useReload()
  React.useEffect(() => {
    console.log('forced reload')
  }, [reload])

  const {selectedFont} = useFont()
  const theme = extendTheme({
    fonts: {
      heading: selectedFont,
      body: selectedFont,
    },
  })

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap"
          rel="stylesheet"
        />

        <style>{`
          @font-face {
            font-family: 'opendyslexic';
            src: url('http://dyslexicfonts.com/fonts/OpenDyslexic-Regular.otf');
            font-style: normal;
            font-weight: normal;
          }
        `}</style>
      </Head>
      <Auth0Provider
        domain={'kehilla.us.auth0.com'}
        clientId={'prSMU4xVFRZT7Dg1BCaGQcu12PIhovis'}
        redirectUri={'http://localhost:9797/'}
        audience={'https://prayerbooks.auth/'}
      >
        <ApiProvider initialState={pageProps.initialApolloState}>
          <ChakraProvider theme={theme}>
            <CSSReset />
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </ChakraProvider>
        </ApiProvider>
      </Auth0Provider>
    </>
  )
}
