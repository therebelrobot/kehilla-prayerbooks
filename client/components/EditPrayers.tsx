import React, {FC, useState} from 'react'

import Link from 'next/link'
import {move} from 'ramda'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import {CgChevronLeftO} from 'react-icons/cg'
import {MdAddCircleOutline} from 'react-icons/md'
import {EditOrDisplayPrayer} from './EditOrDisplayPrayer'

import {
    Box, Heading, IconButton, Link as ChLink, List, ListIcon, ListItem, Spacer
} from '@chakra-ui/react'

import {CreatePrayer} from '_/components/CreatePrayer'
import {
    GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY,
    useGetPrayersBySectionAndBookSlug, useUpdateSection
} from '_/services/Api/queries'

interface EditPrayersProps {
  bookSlug: string
  sectionSlug: string
}

export const EditPrayers: FC<EditPrayersProps> = ({bookSlug, sectionSlug}) => {
  const {loading, error, prayers, data, prayerOrder, orderedPrayers, sectionId} =
    useGetPrayersBySectionAndBookSlug(bookSlug, sectionSlug)
  const [editingId, setEditingId] = React.useState<number>(null)
  const [showCreatePrayer, setShowCreatePrayer] = useState(false)
  const {updateSection} = useUpdateSection(sectionId, bookSlug)

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
      <DragDropContext
        onDragEnd={({source, destination}) => {
          const newPrayerOrder = move(source.index, destination.index, prayerOrder)
          console.log(prayerOrder, newPrayerOrder)
          updateSection({
            variables: {_set: {prayer_order: newPrayerOrder}},
            refetchQueries: [
              {
                query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY,
                variables: {bookSlug, sectionSlug},
              },
            ],
          })
        }}
      >
        <Droppable droppableId="droppable-prayer-list">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <List spacing={3}>
                {orderedPrayers.map((prayer, index) => (
                  <Draggable key={String(prayer.id)} draggableId={String(prayer.id)} index={index}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <EditOrDisplayPrayer
                          dragHandleProps={provided.dragHandleProps}
                          bookSlug={bookSlug}
                          sectionSlug={sectionSlug}
                          prayer={prayer}
                          editingId={editingId}
                          setEditingId={setEditingId}
                        />
                      </div>
                    )}
                  </Draggable>
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
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}
