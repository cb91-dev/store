module.exports = {
  reactStrictMode: true,
}
const nextConfig = {
  reactStrictMode: true,
}

const { withSuperjson } = require('next-superjson')

module.exports = withSuperjson()(nextConfig)