require('dotenv').config()

module.exports = {
  port: process.env.PORT,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    HOSTNAME: process.env.HOSTNAME,
    PORT: process.env.PORT,
    SSL: process.env.SSL,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })
    return config
  },
  webpackDevMiddleware: (config) => {
    return config
  },
}
