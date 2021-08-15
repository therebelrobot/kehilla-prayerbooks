import React, {FC} from 'react'

import {kebabCase} from 'case-anything'
import {Field, Form, Formik} from 'formik'
import isUrl from 'is-url'
import Link from 'next/link'
import {CgTrash} from 'react-icons/cg'
import {
    MdCancel, MdModeEdit, MdNewReleases, MdOpenInBrowser, MdPauseCircleFilled,
    MdSwapVerticalCircle
} from 'react-icons/md'

import {
    Box, Button, FormControl, FormErrorMessage, FormLabel, Input,
    Link as ChLink, List, ListIcon, ListItem, Radio, RadioGroup, Text
} from '@chakra-ui/react'

import {useListPrayerbooks, useUpdateBook} from '_/services/Api/queries'

interface EditPrayerbooksProps {}

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

const EditOrDisplayBook = ({book, editingId, setEditingId}) => {
  const {updateBook} = useUpdateBook(book.id)
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
            }).then(() => {
              setEditingId(null)
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
      <ChLink>
        <Link href={`/reading/${book.slug}`}>
          <MdOpenInBrowser />
        </Link>
      </ChLink>
      <ChLink onClick={() => setEditingId(book.id)}>
        <MdModeEdit />
      </ChLink>
      <ChLink>
        <CgTrash />
      </ChLink>
    </ListItem>
  )
}

export const EditPrayerbooks: FC<EditPrayerbooksProps> = ({}) => {
  const {loading, error, books} = useListPrayerbooks()
  const [editingId, setEditingId] = React.useState<number>(null)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :( {JSON.stringify(error)}</p>
  return (
    <>
      <List spacing={3}>
        {books.map((book) => (
          <EditOrDisplayBook book={book} editingId={editingId} setEditingId={setEditingId} />
        ))}
      </List>
    </>
  )
}
