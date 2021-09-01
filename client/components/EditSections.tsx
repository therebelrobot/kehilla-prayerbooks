import React, {FC, useState} from 'react'

import Link from 'next/link'
import {move} from 'ramda'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import {CgChevronLeftO} from 'react-icons/cg'
import {
    MdAddCircleOutline, MdCancel, MdNewReleases, MdPauseCircleFilled,
    MdSwapVerticalCircle
} from 'react-icons/md'
import {EditOrDisplaySection} from './EditOrDisplaySection'

import {
    Box, Heading, IconButton, Link as ChLink, List, ListIcon, ListItem, Spacer
} from '@chakra-ui/react'

import {CreateSection} from '_/components/CreateSection'
import {
    GET_SECTIONS_BY_BOOK_SLUG_QUERY, useGetSectionsByBookSlug, useUpdateBook
} from '_/services/Api/queries'

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
  const {loading, error, sections, data, sectionOrder, orderedSections, bookId} =
    useGetSectionsByBookSlug(bookSlug)
  const {updateBook} = useUpdateBook(bookId)
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
      <DragDropContext
        onDragEnd={({source, destination}) => {
          const newSectionOrder = move(source.index, destination.index, sectionOrder)
          console.log(sectionOrder, newSectionOrder)
          updateBook({
            variables: {_set: {section_order: newSectionOrder}},
            refetchQueries: [{query: GET_SECTIONS_BY_BOOK_SLUG_QUERY, variables: {bookSlug}}],
          })
        }}
      >
        <Droppable droppableId="droppable-section-list">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <List spacing={3}>
                {orderedSections.map((section, index) => (
                  <Draggable
                    key={String(section.id)}
                    draggableId={String(section.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <EditOrDisplaySection
                          dragHandleProps={provided.dragHandleProps}
                          bookSlug={bookSlug}
                          section={section}
                          editingId={editingId}
                          setEditingId={setEditingId}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {showCreateSection ? (
                  <>
                    <hr />
                    <CreateSection
                      bookSlug={bookSlug}
                      setShowCreateSection={setShowCreateSection}
                    />
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
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}
