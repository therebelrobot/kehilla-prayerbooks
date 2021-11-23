import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {Field, Form, Formik} from 'formik'
import {transliterate} from 'hebrew-transliteration'
import {remove} from 'ramda'
import React, {useCallback, useState} from 'react'
import {HebrewInput} from '_/components/HebrewInput'
import {GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY} from '_/services/Api/queries/prayers/GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY'
import {useUpdatePrayer} from '_/services/Api/queries/prayers/useUpdatePrayer'
import {GET_PRAYERS_PROSE_AND_LINES} from '_/services/Api/queries/proseAndLines/GET_PRAYERS_PROSE_AND_LINES'
import {useGetProseAndLines} from '_/services/Api/queries/proseAndLines/useGetProseAndLines'
import {useRemoveLine} from '_/services/Api/queries/proseAndLines/useRemoveLine'
import {useUpdateLine} from '_/services/Api/queries/proseAndLines/useUpdateLine'

export const EditPrayerLine = ({line, bookSlug, sectionSlug, prayerSlug, index}) => {
  console.log({line})
  const initialTrans = transliterate(line.hebrew || '', {isSimple: true, qametsQatan: true})
  const [shouldGenerateTransliteration, setShouldGenerateTransliteration] = useState(
    line.transliteration === initialTrans
  )
  const {updateLine} = useUpdateLine(bookSlug, sectionSlug, prayerSlug)
  const {removeLine} = useRemoveLine(line.id, prayerSlug, sectionSlug, bookSlug)
  const {isOpen, onOpen, onClose} = useDisclosure()

  const {lineProseOrder, prayerId} = useGetProseAndLines(bookSlug, sectionSlug, prayerSlug)
  const {updatePrayer} = useUpdatePrayer(prayerId, bookSlug, sectionSlug)
  const updatePrayerCb = useCallback(() => {
    const newOrder = remove(index, 1, lineProseOrder)
    return updatePrayer({
      variables: {
        _set: {
          line_prose_order: newOrder,
        },
      },
      refetchQueries: [
        {query: GET_PRAYERS_BY_SECTION_AND_BOOK_SLUG_QUERY, variables: {bookSlug, sectionSlug}},
        {query: GET_PRAYERS_PROSE_AND_LINES, variables: {bookSlug, sectionSlug, prayerSlug}},
      ],
    })
  }, [updatePrayer, JSON.stringify(lineProseOrder), bookSlug, sectionSlug, prayerSlug])

  return (
    <>
      <Formik
        initialValues={{
          hebrew: line.hebrew,
          notes: line.notes,
          translation: line.translation,
          transliteration: line.transliteration,
          _submit: null,
        }}
        onSubmit={(values, actions) => {
          console.log({values})
          updateLine({
            variables: {
              id: line.id,
              _set: {
                hebrew: values.hebrew,
                notes: values.notes,
                translation: values.translation,
                transliteration: values.transliteration,
              },
            },
          })
            .then(() => {
              actions.setSubmitting(false)
              actions.setFieldError('_submit', null)
              actions.resetForm({values})
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
            <Field name="hebrew">
              {({field, form}) => (
                <FormControl isInvalid={form.errors.hebrew && form.touched.hebrew}>
                  <FormLabel htmlFor="hebrew">Hebrew</FormLabel>
                  <HebrewInput
                    field={field}
                    onChange={(e) => {
                      if (shouldGenerateTransliteration) {
                        form.setFieldValue(
                          'transliteration',
                          transliterate(e.target.value, {isSimple: true, qametsQatan: true})
                        )
                      }
                      return field.onChange(e)
                    }}
                    id="hebrew"
                    setValue={(value) => {
                      if (shouldGenerateTransliteration) {
                        form.setFieldValue(
                          'transliteration',
                          transliterate(value, {isSimple: true, qametsQatan: true})
                        )
                      }
                      form.setFieldValue('hebrew', value)
                    }}
                  />

                  <FormErrorMessage>{form.errors.hebrew}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="transliteration">
              {({field, form}) => (
                <FormControl
                  isInvalid={form.errors.transliteration && form.touched.transliteration}
                >
                  <FormLabel htmlFor="transliteration">Transliteration</FormLabel>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="email-alerts" mb="0">
                      <Text fontSize="xs">Auto-generate?</Text>
                    </FormLabel>
                    <Switch
                      size="sm"
                      isChecked={shouldGenerateTransliteration}
                      onChange={(e) => {
                        setShouldGenerateTransliteration(e.target.checked)
                        if (e.target.checked) {
                          form.setFieldValue(
                            'transliteration',
                            transliterate(form.values.hebrew, {isSimple: true, qametsQatan: true})
                          )
                        }
                      }}
                    />
                  </FormControl>
                  <Input {...field} id="transliteration" placeholder="" />
                  <FormErrorMessage>{form.errors.transliteration}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="translation">
              {({field, form}) => (
                <FormControl isInvalid={form.errors.translation && form.touched.translation}>
                  <FormLabel htmlFor="translation">Translation</FormLabel>
                  <Input {...field} id="translation" placeholder="" />
                  <FormErrorMessage>{form.errors.translation}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="notes">
              {({field, form}) => (
                <FormControl isInvalid={form.errors.notes && form.touched.notes}>
                  <FormLabel htmlFor="notes">Notes</FormLabel>
                  <Input {...field} id="notes" placeholder="" />
                  <FormErrorMessage>{form.errors.notes}</FormErrorMessage>
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
            <Button
              disabled={!props.dirty}
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Save Prayer Line
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button
              disabled={!props.dirty}
              mt={4}
              colorScheme="gray"
              isLoading={props.isSubmitting}
              onClick={() => props.handleReset()}
            >
              Undo changes
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button mt={4} colorScheme="red" isLoading={props.isSubmitting} onClick={onOpen}>
              Delete
            </Button>
            <Modal onClose={onClose} size="xl" isOpen={isOpen}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Delete Prose Section</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  Are you sure you want to delete this prayer line?{' '}
                  <Text fontWeight="bold" color="red.500">
                    It cannot be undone.
                  </Text>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose}>On second thought, nevermind.</Button>
                  <Box boxSize="8px" />

                  <Button
                    colorScheme="red"
                    onClick={() => {
                      removeLine().then(updatePrayerCb).then(onClose)
                    }}
                  >
                    Yes, I want this gone forever.
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  )
}
