import React, {FC} from 'react'

import {Box, Input} from '@chakra-ui/react'

import {useGreetingLocation} from '_/services/Api/queries'
import {useFriendName} from '_/services/state'

interface ExampleComponentProps {
  greeting: string
}

export const ExampleComponent: FC<ExampleComponentProps> = ({greeting}) => {
  const {fancyFriendName, friendName, updateFriendName} = useFriendName()

  const {loading, error, data} = useGreetingLocation()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return (
    <>
      <Box>{greeting}</Box>
      <Box>{fancyFriendName}</Box>
      <Box>
        <Input
          value={friendName}
          onChange={(e) => {
            const value = e.target.value
            updateFriendName(value)
          }}
        />
      </Box>
      <Box>from {data.greetingLocation.name}</Box>
    </>
  )
}
