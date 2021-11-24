import {Button, Container} from '@chakra-ui/react'
import NLink from 'next/link'
import React, {FC} from 'react'
import {CgChevronLeftO, CgChevronRightO} from 'react-icons/cg'
import {useGetNextAndPreviousPrayers} from '_/services/Api/queries/prayers/useGetNextAndPreviousPrayers'

interface ShowPrayerProps {
  bookSlug: string
  sectionSlug: string
  prayerSlug: string
}

export const NavigationButtons: FC<ShowPrayerProps> = ({bookSlug, sectionSlug, prayerSlug}) => {
  const {next, prev} = useGetNextAndPreviousPrayers(bookSlug, sectionSlug, prayerSlug)
  console.log({next, prev})
  return (
    <Container
      maxW="100%"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      marginY={8}
    >
      {prev ? (
        <NLink href={`/reading/${prev.book_slug}/${prev.section_slug}/${prev.slug}`}>
          <Button size="xs" leftIcon={<CgChevronLeftO />} variant="solid">
            Pg {prev.from_page} - {prev.name}
          </Button>
        </NLink>
      ) : (
        <div />
      )}
      {next ? (
        <NLink href={`/reading/${next.book_slug}/${next.section_slug}/${next.slug}`}>
          <Button size="xs" leftIcon={<CgChevronRightO />} variant="solid">
            Pg {next.from_page} - {next.name}
          </Button>
        </NLink>
      ) : (
        <div />
      )}
    </Container>
  )
}
