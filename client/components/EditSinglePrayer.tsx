import {Container, Heading as ChHeading, IconButton, List, Spacer} from '@chakra-ui/react'
import NLink from 'next/link'
import React, {FC} from 'react'
import {CgChevronLeftO} from 'react-icons/cg'
import {MdCancel, MdNewReleases, MdPauseCircleFilled, MdSwapVerticalCircle} from 'react-icons/md'
import {AddNewProseOrLine} from '_/components/AddNewProseOrLine'
import {TipTapProse} from '_/components/TipTapProse'
import {useGetProseAndLines} from '_/services/Api/queries'

interface EditSinglePrayerProps {
  bookSlug: string
  sectionSlug: string
  prayerSlug: string
}

const statusIcons = {
  UNSTARTED: MdCancel,
  IN_PROGRESS: MdSwapVerticalCircle,
  STALLED: MdPauseCircleFilled,
  COMPLETE: MdNewReleases,
}
const statusColors = {
  UNSTARTED: 'gray',
  IN_PROGRESS: 'orange',
  STALLED: 'red',
  COMPLETE: 'green',
}

export const EditSinglePrayer: FC<EditSinglePrayerProps> = ({
  bookSlug,
  sectionSlug,
  prayerSlug,
}) => {
  const {loading, error, data, prose, lines, ordered, prayerId} = useGetProseAndLines(
    bookSlug,
    sectionSlug,
    prayerSlug
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>
  return (
    <>
      <ChHeading size="md" display="flex" flexDirection="row" alignItems="center">
        <NLink href={`/editing/${bookSlug}/${sectionSlug}`}>
          <IconButton
            icon={<CgChevronLeftO />}
            size="xs"
            aria-label={`return to ${data.prayerbooks[0].sections[0].name}`}
          />
        </NLink>
        <Spacer boxSize="8px" />
        {data.prayerbooks[0].sections[0].prayers[0].name}
      </ChHeading>
      <Container>
        <List spacing={3}>
          <AddNewProseOrLine
            prayerId={prayerId}
            prayerSlug={prayerSlug}
            bookSlug={bookSlug}
            sectionSlug={sectionSlug}
            nextIndex={0}
          />
          {ordered.map((item, index) => {
            console.log({item})
            if (item.type === 'prose') {
              return (
                <>
                  <TipTapProse
                    content={item.tiptap_content}
                    prayerId={prayerId}
                    id={item.id}
                    prayerSlug={prayerSlug}
                    bookSlug={bookSlug}
                    sectionSlug={sectionSlug}
                  />

                  <AddNewProseOrLine
                    prayerId={prayerId}
                    prayerSlug={prayerSlug}
                    bookSlug={bookSlug}
                    sectionSlug={sectionSlug}
                    nextIndex={Number(index) + 1}
                  />
                </>
              )
            }
            return null
          })}
        </List>
      </Container>
    </>
  )
}
