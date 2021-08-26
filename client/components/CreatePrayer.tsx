import {Button, FormControl, FormErrorMessage, FormLabel, Input, ListItem} from '@chakra-ui/react'
import {kebabCase} from 'case-anything'
import {Field, Form, Formik, useFormikContext} from 'formik'
import React from 'react'
import {useInsertPrayer} from '_/services/Api/queries'

export const CreatePrayer = ({setShowCreatePrayer, bookSlug, sectionSlug}) => {
  const {insertPrayer} = useInsertPrayer(bookSlug, sectionSlug)
  const formikContext = useFormikContext()
  console.log({formikContext})
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
          _submit: null,
        }}
        onSubmit={(values, actions) => {
          insertPrayer({
            variables: {
              name: values.name,
              slug: values.slug,
              section_slug: sectionSlug,
            },
          })
            .then(() => {
              actions.setFieldError('_submit', null)
              setShowCreatePrayer(false)
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
              onClick={() => setShowCreatePrayer(false)}
            >
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </ListItem>
  )
}
