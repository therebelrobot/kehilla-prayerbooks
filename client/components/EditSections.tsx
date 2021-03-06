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
import {move} from 'ramda'
import React, {FC, useState} from 'react'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import {CgChevronLeftO} from 'react-icons/cg'
import {MdAddCircleOutline} from 'react-icons/md'
import {CreateSection} from '_/components/CreateSection'
import {useUpdateBook} from '_/services/Api/queries/prayerbooks/useUpdateBook'
import {GET_SECTIONS_BY_BOOK_SLUG_QUERY} from '_/services/Api/queries/sections/GET_SECTIONS_BY_BOOK_SLUG_QUERY'
import {useGetSectionsByBookSlug} from '_/services/Api/queries/sections/useGetSectionsByBookSlug'
import {EditOrDisplaySection} from './EditOrDisplaySection'

interface EditSectionsProps {
  bookSlug: string
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
                          sectionOrder={sectionOrder}
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
                      sectionOrder={sectionOrder}
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
