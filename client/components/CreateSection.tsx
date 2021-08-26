import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'
import {kebabCase} from 'case-anything'
import {Field, Form, Formik, useFormikContext} from 'formik'
import React from 'react'
import {useInsertSection} from '_/services/Api/queries'

export const CreateSection = ({setShowCreateSection, bookSlug}) => {
  const {insertSection} = useInsertSection(bookSlug)
  const formikContext = useFormikContext()
  console.log({bookSlug})
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
          name: '',
          slug: '',
          pdfPage: '',
          _submit: null,
        }}
        onSubmit={(values, actions) => {
          console.log({values})
          insertSection({
            variables: {
              name: values.name,
              slug: values.slug,
              pdf_page: values.pdfPage,
              book_slug: bookSlug,
            },
          })
            .then(() => {
              actions.setFieldError('_submit', null)
              setShowCreateSection(null)
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
              onClick={() => setShowCreateSection(null)}
            >
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </ListItem>
  )
}
