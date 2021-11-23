import {useSubscription} from '@apollo/client'
import {useState} from 'react'
import {contextIfTokenPresent} from '../utils/contextIfTokenPresent'
import {FOLLOW_READING_SUBSCRIPTION} from './FOLLOW_READING_SUBSCRIPTION'

export const useFollowReading = (sessionId, opts = {}) => {
  const [currentUrl, setCurrentUrl] = useState(null)
  const [currentLocationId, setCurrentLocationId] = useState(null)
  const [connectedCount, setConnectedCount] = useState(null)
  const {data, loading, error} = useSubscription(FOLLOW_READING_SUBSCRIPTION, {
    ...contextIfTokenPresent(),
    variables: {sessionId},
    ...opts,
    onSubscriptionData: (...args) => {
      console.log('onSubscriptionData', args)
      const thisReading = args[0].subscriptionData.data.readings[0]

      setCurrentUrl(thisReading ? thisReading.current_url : null)
      setCurrentLocationId(thisReading ? thisReading.current_location_id : null)
      setConnectedCount(thisReading ? thisReading.connected_readers_aggregate.aggregate.count : 0)
      if (!opts.onSubscriptionData) return
      return opts.onSubscriptionData(...args)
    },
    options: {
      ...opts.options,
      reconnect: !!sessionId,
    },
  })
  console.log('useFollowReading', data)
  return {
    currentUrl,
    currentLocationId,
    connectedCount,
    data,
    loading,
    error,
  }
}
