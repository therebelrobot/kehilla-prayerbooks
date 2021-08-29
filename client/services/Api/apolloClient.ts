import {useMemo} from 'react'

import {ApolloClient, HttpLink, InMemoryCache, split} from '@apollo/client'
import {WebSocketLink} from '@apollo/client/link/ws'
import {concatPagination, getMainDefinition} from '@apollo/client/utilities'

let apolloClient

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: `https://kehilla.h4x.sh/v1/graphql`,
  })
  const wsLink = new WebSocketLink({
    uri: 'wss://kehilla.h4x.sh/v1/graphql',
    options: {
      // reconnect: true,
    },
  })
  const splitLink = split(
    ({query}) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink
  )

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: splitLink,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allPosts: concatPagination(),
          },
        },
      },
    }),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({...existingCache, ...initialState})
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
