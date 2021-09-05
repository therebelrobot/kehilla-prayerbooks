import React from 'react'

import {kebabCase} from 'case-anything'
import {Field, Form, Formik, useFormikContext} from 'formik'
import Link from 'next/link'
import {CgTrash} from 'react-icons/cg'
import {MdDragHandle, MdModeEdit, MdOpenInBrowser} from 'react-icons/md'

import {
    Box, Button, FormControl, FormErrorMessage, FormLabel, Input,
    Link as ChLink, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure
} from '@chakra-ui/react'

import {
    GET_SECTIONS_BY_BOOK_SLUG_QUERY, useRemoveSection, useUpdateBookBySlug,
    useUpdateSection
} from '_/services/Api/queries'

export const EditOrDisplaySection = ({
  section,
  editingId,
  setEditingId,
  bookSlug,
  dragHandleProps,
  sectionOrder,
}) => {
  const {updateSection} = useUpdateSection(section.id, bookSlug)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const {removeSection} = useRemoveSection(section.id, bookSlug)
  const {updateBook} = useUpdateBookBySlug(bookSlug)

  const formikContext = useFormikContext()
  console.log({formikContext})
  if (editingId === section.id) {
    const validateSlug = (value) => {
      let error
      if (!value) {
        error = 'Url slug is required'
      } else if (value !== kebabCase(value)) {
        error = 'Must be a url safe slug (dashes, no numbers)'
      }
      return error
    }

    return (
      <ListItem display="flex" flexDirection="row" alignItems="center">
        <Formik
          initialValues={{
            name: section.name,
            slug: section.slug,
            _submit: null,
          }}
          onSubmit={(values, actions) => {
            updateSection({
              variables: {
                _set: {
                  name: values.name,
                  slug: values.slug,
                  book_slug: bookSlug,
                },
              },
            })
              .then(() => {
                actions.setFieldError('_submit', null)
                setEditingId(null)
              })
              .catch((err) => {
                console.error(err)
                console.log({actions})
                actions.setSubmitting(false)
                actions.setFieldError(
                  '_submit',
                  'Something went wrong. (Do you have permission to do that?)'
                )
              })
          }}
        >
          {(props) => (
            <Form>
              <Field name="name">
                {({field, form}) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name}>
                    <FormLabel htmlFor="name">Section Name</FormLabel>
                    <Input
                      {...field}
                      onChange={(...args) => {
                        form.values.slug = kebabCase(args[0].target.value)
                        field.onChange(...args)
                      }}
                      id="name"
                      placeholder="name"
                    />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="slug" validate={validateSlug}>
                {({field, form}) => (
                  <FormControl isInvalid={form.errors.slug && form.touched.slug}>
                    <FormLabel htmlFor="slug">Url slug</FormLabel>
                    <Input {...field} id="slug" placeholder="slug" />
                    <FormErrorMessage>{form.errors.slug}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="_submit">
                {({field, form}) => (
                  <FormControl isInvalid={form.errors._submit}>
                    <FormErrorMessage>{form.errors._submit}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              {/*  */}
              <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
                Submit
              </Button>
              &nbsp; &nbsp; &nbsp;
              <Button
                mt={4}
                colorScheme="gray"
                isLoading={props.isSubmitting}
                onClick={() => setEditingId(null)}
              >
                Cancel
              </Button>
            </Form>
          )}
        </Formik>
      </ListItem>
    )
  }
  return (
    <ListItem display="flex" flexDirection="row" alignItems="center">
      <div {...dragHandleProps}>
        <Box as={MdDragHandle} mr="16px" cursor="pointer" />
      </div>

      <Text>{section.name}</Text>
      <Box boxSize="8px" />
      <ChLink _hover={{color: 'blue.500'}}>
        <Link href={`/editing/${bookSlug}/${section.slug}`}>
          <MdOpenInBrowser />
        </Link>
      </ChLink>
      <Box boxSize="4px" />
      <ChLink onClick={() => setEditingId(section.id)} _hover={{color: 'green.500'}}>
        <MdModeEdit />
      </ChLink>
      <Box boxSize="4px" />
      <>
        <ChLink onClick={onOpen} _hover={{color: 'red.500'}}>
          <CgTrash />
        </ChLink>
        <Modal onClose={onClose} size="xl" isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete {section.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete the section{' '}
              <Text fontWeight="bold" casing="uppercase" display="inline-block">
                {section.name}
              </Text>
              ? This will remove all prayers, prose and lines contained herein, and{' '}
              <Text fontWeight="bold" color="red.500">
                it cannot be undone.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>On second thought, nevermind.</Button>
              <Box boxSize="8px" />

              <Button
                colorScheme="red"
                onClick={() => {
                  removeSection()
                    .then(() => {
                      const newSectionOrder = sectionOrder.filter((s) => s.id !== section.id)
                      console.log(sectionOrder, newSectionOrder)
                      updateBook({
                        variables: {_set: {section_order: newSectionOrder}},
                        refetchQueries: [
                          {query: GET_SECTIONS_BY_BOOK_SLUG_QUERY, variables: {bookSlug}},
                        ],
                      })
                    })
                    .then(onClose)
                }}
              >
                Yes, I want this gone forever.
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </ListItem>
  )
}
