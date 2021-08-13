import * as React from 'react'

import {Box} from '@chakra-ui/react'

import {ExampleComponent} from '_/components/ExampleComponent'

export const HomeLayout = () => {
  // Homepage layout is created here.
  // Do not put state handling here (Graphql, useState, etc.)
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <ExampleComponent greeting="Hello" />
    </Box>
  )
}
