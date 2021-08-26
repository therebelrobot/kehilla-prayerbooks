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
import {
  MdAddCircleOutline,
  MdCancel,
  MdNewReleases,
  MdPauseCircleFilled,
  MdSwapVerticalCircle,
} from 'react-icons/md'
import {CreateSection} from '_/components/CreateSection'
import {useGetSectionsByBookSlug} from '_/services/Api/queries'
import {EditOrDisplaySection} from './EditOrDisplaySection'

interface EditSectionsProps {
  bookSlug: string
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

export const EditSections: FC<EditSectionsProps> = ({bookSlug}) => {
  const {loading, error, sections, data} = useGetSectionsByBookSlug(bookSlug)
  const [editingId, setEditingId] = React.useState<number>(null)
  const [showCreateSection, setShowCreateSection] = useState(false)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>
  return (
    <>
      <Heading size="md" display="flex" flexDirection="row" alignItems="center">
        <Link href={`/editing/`}>
          <IconButton
            icon={<CgChevronLeftO />}
            size="xs"
            aria-label={`return to List of prayerbooks`}
          />
        </Link>
        <Spacer boxSize="8px" />
        {data.prayerbooks[0].name} Sections
      </Heading>
      <Box width="100%" mt="16px" mb="16px">
        {' '}
        <hr />
      </Box>

      <List spacing={3}>
        {sections.map((section) => (
          <EditOrDisplaySection
            bookSlug={bookSlug}
            section={section}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        ))}

        {showCreateSection ? (
          <>
            <hr />
            <CreateSection bookSlug={bookSlug} setShowCreateSection={setShowCreateSection} />
          </>
        ) : (
          <>
            <hr />
            <ListItem display="flex" flexDirection="row" alignItems="center">
              <ListIcon as={MdAddCircleOutline} color={`green.500`} />
              <ChLink onClick={() => setShowCreateSection(true)}>Add a new section</ChLink>
            </ListItem>
          </>
        )}
      </List>
    </>
  )
}