import React, {FC} from 'react'

import {kebabCase} from 'case-anything'
import {Field, Form, Formik, useFormikContext} from 'formik'
import Link from 'next/link'
import {CgChevronLeftO, CgTrash} from 'react-icons/cg'
import {
    MdCancel, MdModeEdit, MdNewReleases, MdOpenInBrowser, MdPauseCircleFilled,
    MdSwapVerticalCircle
} from 'react-icons/md'

import {
    Button, FormControl, FormErrorMessage, FormLabel, Heading, IconButton,
    Input, Link as ChLink, List, ListItem, NumberDecrementStepper,
    NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
    Spacer, Text
} from '@chakra-ui/react'

import {
    useGetSectionsByBookSlug, useUpdateSection
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

const EditOrDisplaySection = ({section, editingId, setEditingId, bookSlug}) => {
  const {updateSection} = useUpdateSection(section.id, bookSlug)
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
      <ChLink>
        <Link href={`/editing/${bookSlug}/${section.slug}`}>
          <MdOpenInBrowser />
        </Link>
      </ChLink>
      <ChLink onClick={() => setEditingId(section.id)}>
        <MdModeEdit />
      </ChLink>
      <ChLink>
        <CgTrash />
      </ChLink>
    </ListItem>
  )
}

export const EditSections: FC<EditSectionsProps> = ({bookSlug}) => {
  const {loading, error, sections, data} = useGetSectionsByBookSlug(bookSlug)
  const [editingId, setEditingId] = React.useState<number>(null)

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
      <List spacing={3}>
        {sections.map((section) => (
          <EditOrDisplaySection
            bookSlug={bookSlug}
            section={section}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        ))}
      </List>
    </>
  )
}
