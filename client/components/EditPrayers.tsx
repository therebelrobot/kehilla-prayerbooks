import React, {FC} from 'react'

import {kebabCase} from 'case-anything'
import {Field, Form, Formik, useFormikContext} from 'formik'
import Link from 'next/link'
import {CgChevronLeftO, CgTrash} from 'react-icons/cg'
import {MdModeEdit, MdOpenInBrowser} from 'react-icons/md'

import {
    Button, FormControl, FormErrorMessage, FormLabel, Heading, IconButton,
    Input, Link as ChLink, List, ListItem, Spacer, Text
} from '@chakra-ui/react'

import {
    useGetPrayersBySectionAndBookSlug, useUpdatePrayer
} from '_/services/Api/queries'

interface EditPrayersProps {
  bookSlug: string
  sectionSlug: string
}

const EditOrDisplayPrayer = ({prayer, editingId, setEditingId, bookSlug, sectionSlug}) => {
  const {updatePrayer} = useUpdatePrayer(prayer.id, bookSlug, sectionSlug)
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
      <ChLink>
        <Link href={`/editing/${bookSlug}/${sectionSlug}/${prayer.slug}`}>
          <MdOpenInBrowser />
        </Link>
      </ChLink>
      <ChLink onClick={() => setEditingId(prayer.id)}>
        <MdModeEdit />
      </ChLink>
      <ChLink>
        <CgTrash />
      </ChLink>
    </ListItem>
  )
}

export const EditPrayers: FC<EditPrayersProps> = ({bookSlug, sectionSlug}) => {
  const {loading, error, prayers, data} = useGetPrayersBySectionAndBookSlug(bookSlug, sectionSlug)
  const [editingId, setEditingId] = React.useState<number>(null)

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
      <List spacing={3}>
        {prayers.map((prayer) => (
          <EditOrDisplayPrayer
            bookSlug={bookSlug}
            sectionSlug={sectionSlug}
            prayer={prayer}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        ))}
      </List>
    </>
  )
}
