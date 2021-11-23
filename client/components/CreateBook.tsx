import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ListItem,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import {kebabCase} from 'case-anything'
import {Field, Form, Formik} from 'formik'
import isUrl from 'is-url'
import React from 'react'
import {useInsertBook} from '_/services/Api/queries/prayerbooks/useInsertBook'

export const CreateBook = ({setShowCreateBook}) => {
  const {insertBook} = useInsertBook()
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
          name: '',
          slug: '',
          status: 'UNSTARTED',
          pdfLink: '',
          _submit: null,
        }}
        onSubmit={(values, actions) => {
          insertBook({
            variables: {
              name: values.name,
              slug: values.slug,
              status: values.status,
              pdf_link: values.pdfLink,
            },
          })
            .then(() => {
              actions.setFieldError('_submit', null)
              setShowCreateBook(false)
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
                  <FormLabel htmlFor="name">New Prayerbook Name</FormLabel>
                  <Input
                    {...field}
                    onChange={(...args) => {
                      form.values.slug = kebabCase(args[0].target.value)
                      field.onChange(...args)
                    }}
                    id="name"
                    placeholder="Prayerbook Name"
                  />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="slug" validate={validateSlug}>
              {({field, form}) => (
                <FormControl isInvalid={form.errors.slug && form.touched.slug}>
                  <FormLabel htmlFor="slug">Url slug</FormLabel>
                  <Input {...field} id="slug" placeholder="URL Slug" />
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
                  <Input {...field} id="pdfLink" placeholder="Link to PDF" />
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
              onClick={() => setShowCreateBook(null)}
            >
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </ListItem>
  )
}
