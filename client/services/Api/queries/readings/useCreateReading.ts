import {useMutation} from '@apollo/client'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {INSERT_READING_MUTATION} from './INSERT_READING_MUTATION'

export const useCreateReading = (userId) => {
  const [createReading, {loading, error, data}] = useMutation(INSERT_READING_MUTATION, {
    ...contextIfTokenPresent(),
    variables: {created_by: userId},
  })
  return {createReading, loading, error, data}
}
