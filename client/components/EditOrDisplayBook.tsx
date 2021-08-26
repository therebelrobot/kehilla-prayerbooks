import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link as ChLink,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {kebabCase} from 'case-anything'
import {Field, Form, Formik, useFormikContext} from 'formik'
import isUrl from 'is-url'
import Link from 'next/link'
import React from 'react'
import {CgTrash} from 'react-icons/cg'
import {MdModeEdit, MdOpenInBrowser} from 'react-icons/md'
import {useRemoveBook, useUpdateBook} from '_/services/Api/queries'
import {statusColors, statusIcons} from './EditPrayerbooks'

export const EditOrDisplayBook = ({book, editingId, setEditingId}) => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const {updateBook} = useUpdateBook(book.id)
  const {removeBook} = useRemoveBook(book.id)
  const formikContext = useFormikContext()
  console.log({formikContext})
  if (editingId === book.id) {
    const validateSlug = (value) => {
      let error
      if (!value) {
        error = 'Url slug is required'
      } else if (value !== kebabCase(value)) {
        error = 'Must be a url safe slug (dashes, no numbers)'
      }
      return error
    }
    const validateUrl = (value) => {
      let error
      if (!isUrl(value)) {
        error = 'Must be a valid url'
      }
      return error
    }

    return (
      <ListItem display="flex" flexDirection="row" alignItems="center">
        <Formik
          initialValues={{
            name: book.name,
            slug: book.slug,
            status: book.status,
            pdfLink: book.pdf_link,
            _submit: null,
          }}
          onSubmit={(values, actions) => {
            updateBook({
              variables: {
                _set: {
                  name: values.name,
                  slug: values.slug,
                  status: values.status,
                  pdf_link: values.pdfLink,
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
                    <FormLabel htmlFor="name">Prayerbook Name</FormLabel>
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
              <Field name="status">
                {({field, form}) => {
                  const {onChange, ...rest} = field
                  return (
                    <FormControl
                      id="status"
                      isInvalid={!!form.errors.status && !!form.touched.status}
                    >
                      <FormLabel htmlFor="status">Project Status:</FormLabel>
                      <RadioGroup
                        {...rest}
                        id="status"
                        {...props}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <Radio onChange={onChange} value="UNSTARTED">
                          Unstarted
                        </Radio>
                        <Box boxSize="8px" flexShrink={0} />
                        <Radio onChange={onChange} value="IN_PROGRESS">
                          In progress
                        </Radio>
                        <Box boxSize="8px" flexShrink={0} />
                        <Radio onChange={onChange} value="STALLED">
                          Stalled
                        </Radio>
                        <Box boxSize="8px" flexShrink={0} />
                        <Radio onChange={onChange} value="COMPLETE">
                          Complete
                        </Radio>
                      </RadioGroup>
                      <FormErrorMessage>{form.errors.status}</FormErrorMessage>
                    </FormControl>
                  )
                }}
              </Field>
              <Field name="pdfLink" validate={validateUrl}>
                {({field, form}) => (
                  <FormControl isInvalid={form.errors.pdfLink && form.touched.pdfLink}>
                    <FormLabel htmlFor="pdfLink">PDF Download Link</FormLabel>
                    <Input {...field} id="pdfLink" placeholder="pdfLink" />
                    <FormErrorMessage>{form.errors.pdfLink}</FormErrorMessage>
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
      <ListIcon as={statusIcons[book.status]} color={`${statusColors[book.status]}.500`} />
      <Text>{book.name}</Text>
      <Box boxSize="8px" />
      <ChLink _hover={{color: 'blue.500'}}>
        <Link href={`/editing/${book.slug}`}>
          <MdOpenInBrowser />
        </Link>
      </ChLink>
      <Box boxSize="4px" />
      <ChLink onClick={() => setEditingId(book.id)} _hover={{color: 'green.500'}}>
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
            <ModalHeader>Delete {book.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete the prayerbook{' '}
              <Text fontWeight="bold" casing="uppercase" display="inline-block">
                {book.name}
              </Text>
              ? This will remove all sections, prayers, prose and lines contained herein, and{' '}
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
                  removeBook().then(onClose)
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
