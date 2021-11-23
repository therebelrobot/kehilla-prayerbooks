import {Link, List, ListIcon, ListItem} from '@chakra-ui/react'
import React, {FC, useState} from 'react'
import {
  MdAddCircleOutline,
  MdCancel,
  MdNewReleases,
  MdPauseCircleFilled,
  MdSwapVerticalCircle,
} from 'react-icons/md'
import {CreateBook} from '_/components/CreateBook'
import {useListPrayerbooks} from '_/services/Api/queries/prayerbooks/useListPrayerbooks'
import {EditOrDisplayBook} from './EditOrDisplayBook'

interface EditPrayerbooksProps {}

export const statusIcons = {
  UNSTARTED: MdCancel,
  IN_PROGRESS: MdSwapVerticalCircle,
  STALLED: MdPauseCircleFilled,
  COMPLETE: MdNewReleases,
}
export const statusColors = {
  UNSTARTED: 'gray',
  IN_PROGRESS: 'orange',
  STALLED: 'red',
  COMPLETE: 'green',
}

export const EditPrayerbooks: FC<EditPrayerbooksProps> = ({}) => {
  const {loading, error, books} = useListPrayerbooks()
  const [editingId, setEditingId] = React.useState<number>(null)
  const [showCreateBook, setShowCreateBook] = useState(false)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>
  return (
    <>
      <List spacing={3}>
        {books.map((book) => (
          <EditOrDisplayBook book={book} editingId={editingId} setEditingId={setEditingId} />
        ))}
        {showCreateBook ? (
          <>
            <hr />
            <CreateBook setShowCreateBook={setShowCreateBook} />
          </>
        ) : (
          <>
            <hr />
            <ListItem display="flex" flexDirection="row" alignItems="center">
              <ListIcon as={MdAddCircleOutline} color={`green.500`} />
              <Link onClick={() => setShowCreateBook(true)}>Add a new prayerbook</Link>
            </ListItem>
          </>
        )}
      </List>
    </>
  )
}
