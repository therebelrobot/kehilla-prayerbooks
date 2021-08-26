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
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {kebabCase} from 'case-anything'
import {Field, Form, Formik, useFormikContext} from 'formik'
import Link from 'next/link'
import React from 'react'
import {CgTrash} from 'react-icons/cg'
import {MdModeEdit, MdOpenInBrowser} from 'react-icons/md'
import {useRemovePrayer, useUpdatePrayer} from '_/services/Api/queries'

export const EditOrDisplayPrayer = ({prayer, editingId, setEditingId, bookSlug, sectionSlug}) => {
  const {updatePrayer} = useUpdatePrayer(prayer.id, bookSlug, sectionSlug)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const {removePrayer} = useRemovePrayer(prayer.id, bookSlug, sectionSlug)

  const formikContext = useFormikContext()
  console.log({formikContext})
  if (editingId === prayer.id) {
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
            name: prayer.name,
            slug: prayer.slug,
            _submit: null,
          }}
          onSubmit={(values, actions) => {
            updatePrayer({
              variables: {
                _set: {
                  name: values.name,
                  slug: values.slug,
                  section_slug: sectionSlug,
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
                    <FormLabel htmlFor="name">Prayer Name</FormLabel>
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
      <Text>{prayer.name}</Text>
      <Box boxSize="8px" />
      <ChLink _hover={{color: 'blue.500'}}>
        <Link href={`/editing/${bookSlug}/${sectionSlug}/${prayer.slug}`}>
          <MdOpenInBrowser />
        </Link>
      </ChLink>
      <Box boxSize="4px" />
      <ChLink onClick={() => setEditingId(prayer.id)} _hover={{color: 'green.500'}}>
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
            <ModalHeader>Delete {prayer.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete the prayer{' '}
              <Text fontWeight="bold" casing="uppercase" display="inline-block">
                {prayer.name}
              </Text>
              ? This will remove all prose and lines contained herein, and{' '}
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
                  removePrayer().then(onClose)
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