import {useMemo} from 'react'

// from https://github.com/vercel/next.js/blob/master/examples/with-apollo/lib/apolloClient.js
import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {concatPagination} from '@apollo/client/utilities'

let apolloClient

function createApolloClient() {
  const link = new HttpLink({
    uri: `https://kehilla.h4x.sh/v1/graphql`,
  })

  const setAuthorizationLink = setContext((request, previousContext) => ({
    headers: {
      ...previousContext.headers,
      authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  }))

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: setAuthorizationLink.concat(link),
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
