import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link as ChLink,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {kebabCase} from 'case-anything'
import {Field, Form, Formik, useFormikContext} from 'formik'
import Link from 'next/link'
import React from 'react'
import {CgTrash} from 'react-icons/cg'
import {MdModeEdit, MdOpenInBrowser} from 'react-icons/md'
import {useRemoveSection, useUpdateSection} from '_/services/Api/queries'

export const EditOrDisplaySection = ({section, editingId, setEditingId, bookSlug}) => {
  const {updateSection} = useUpdateSection(section.id, bookSlug)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const {removeSection} = useRemoveSection(section.id, bookSlug)

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
            pdfPage: section.pdf_page,
            _submit: null,
          }}
          onSubmit={(values, actions) => {
            updateSection({
              variables: {
                _set: {
                  name: values.name,
                  slug: values.slug,
                  pdf_page: values.pdfPage,
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
              <Field name="pdfPage">
                {({field, form}) => (
                  <FormControl isInvalid={form.errors.pdfPage && form.touched.pdfPage}>
                    <FormLabel htmlFor="pdfPage">PDF Page #</FormLabel>
                    <NumberInput defaultValue={field.value}>
                      <NumberInputField {...field} id="pdfPage" placeholder="pdfPage" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{form.errors.pdfPage}</FormErrorMessage>
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
                  removeSection().then(onClose)
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
