import {ApolloServer, Config} from 'apollo-server-micro'

import {db} from '__/data/db'
import {resolvers} from '__/resolvers'
import typeDefs from '__/schema.graphql'

const ENDPOINT = '/api/graphql'

type GraphqlContext = {
  db: typeof db
}

const context = {db} as const

const apolloConfig: Config = {
  typeDefs,
  resolvers,
  context: ({req}): GraphqlContext => {
    return {
      ...context,
      // user: req.user,
    }
  },
  playground: {
    settings: {
      'request.credentials': 'include',
    },
  },
  introspection: true,
}

const apolloServer = new ApolloServer(apolloConfig)

export const endpointConfig = {
  api: {
    bodyParser: false,
  },
}

export const graphqlEndpoint = apolloServer.createHandler({path: ENDPOINT})
