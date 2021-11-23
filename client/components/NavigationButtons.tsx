import {Button, Container} from '@chakra-ui/react'
import React, {FC} from 'react'
import {CgChevronLeftO, CgChevronRightO} from 'react-icons/cg'

interface ShowPrayerProps {
  bookSlug: string
  sectionSlug: string
  prayerSlug: string
}

export const NavigationButtons: FC<ShowPrayerProps> = ({bookSlug, sectionSlug, prayerSlug}) => {
  return (
    <Container
      maxW="100%"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-around"
      marginY={8}
    >
      <Button size="xs" leftIcon={<CgChevronLeftO />} variant="solid">
        Pg {2} - Name of Prayer
      </Button>
      <Button size="xs" leftIcon={<CgChevronRightO />} variant="solid">
        Pg {5} - Hin'ey tov
      </Button>
    </Container>
  )
}
