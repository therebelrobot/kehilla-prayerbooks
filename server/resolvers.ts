export const resolvers = {
  Query: {
    greetingLocation(parent, args, {db}) {
      return {name: 'The Moon', geolocation: '123456, 123456'}
    },
  },
}
