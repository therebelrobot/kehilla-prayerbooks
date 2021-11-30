import {Auth0Provider} from '@auth0/auth0-react'
import {ChakraProvider, CSSReset, extendTheme} from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
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
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=David+Libre:wght@400;500;700&display=swap"
          rel="stylesheet"
        ></link>

        <style>{`
          @font-face {
            font-family: 'opendyslexic';
            src: url('http://dyslexicfonts.com/fonts/OpenDyslexic-Regular.otf');
            font-style: normal;
            font-weight: normal;
          }
          .hebrew, .hebrew span {
            font-size: 25px;
            font-weight: bold;
            font-family: 'David Libre', Spectral, sans-serif;
          }
        `}</style>
      </Head>
      <Auth0Provider
        domain={'kehilla.us.auth0.com'}
        clientId={'xhuzONOiJOaJBnukhbiPoqHxCSJqvGRa'}
        redirectUri={`${window.location.protocol}//${window.location.host}/`}
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
