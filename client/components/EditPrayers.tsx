import {
  Box,
  Heading,
  IconButton,
  Link as ChLink,
  List,
  ListIcon,
  ListItem,
  Spacer,
} from '@chakra-ui/react'
import Link from 'next/link'
import React, {FC, useState} from 'react'
import {CgChevronLeftO} from 'react-icons/cg'
import {MdAddCircleOutline} from 'react-icons/md'
import {CreatePrayer} from '_/components/CreatePrayer'
import {useGetPrayersBySectionAndBookSlug} from '_/services/Api/queries'
import {EditOrDisplayPrayer} from './EditOrDisplayPrayer'

interface EditPrayersProps {
  bookSlug: string
  sectionSlug: string
}

export const EditPrayers: FC<EditPrayersProps> = ({bookSlug, sectionSlug}) => {
  const {loading, error, prayers, data} = useGetPrayersBySectionAndBookSlug(bookSlug, sectionSlug)
  const [editingId, setEditingId] = React.useState<number>(null)
  const [showCreatePrayer, setShowCreatePrayer] = useState(false)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>
  return (
    <>
      <Heading size="md" display="flex" flexDirection="row" alignItems="center">
        <Link href={`/editing/${bookSlug}`}>
          <IconButton
            icon={<CgChevronLeftO />}
            size="xs"
            aria-label={`return to List of prayerbooks`}
          />
        </Link>
        <Spacer boxSize="8px" />
        {data.prayerbooks[0].name}
      </Heading>
      <Heading size="sm" display="flex" flexDirection="row" alignItems="center">
        {data.prayerbooks[0].sections[0].name}
      </Heading>

      <Box width="100%" mt="16px" mb="16px">
        {' '}
        <hr />
      </Box>
      <List spacing={3}>
        {prayers.map((prayer) => (
          <EditOrDisplayPrayer
            bookSlug={bookSlug}
            sectionSlug={sectionSlug}
            prayer={prayer}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        ))}

        {showCreatePrayer ? (
          <>
            <hr />
            <CreatePrayer
              bookSlug={bookSlug}
              sectionSlug={sectionSlug}
              setShowCreatePrayer={setShowCreatePrayer}
            />
          </>
        ) : (
          <>
            <hr />
            <ListItem display="flex" flexDirection="row" alignItems="center">
              <ListIcon as={MdAddCircleOutline} color={`green.500`} />
              <ChLink onClick={() => setShowCreatePrayer(true)}>Add a new prayer</ChLink>
            </ListItem>
          </>
        )}
      </List>
    </>
  )
}
