import React from 'react'

import {Box, Button} from '@chakra-ui/react'

export const ExpandingMenuButton = ({
  colorScheme = 'gray',
  isHovering,
  onClick,
  children,
  width = '32px',
  hoverWidth = '225px',
}) => {
  return (
    <Box>
      <Button
        transition="width 0.3s ease, background-color 0.2s linear"
        width={!isHovering ? width : hoverWidth}
        overflow="hidden"
        textAlign="left"
        position="relative"
        borderRadius={0}
        onClick={onClick}
        colorScheme={colorScheme}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          position="absolute"
          left={0}
          top="50%"
          transform="translateY( -50% )"
        >
          {children}
        </Box>
      </Button>
    </Box>
  )
}
