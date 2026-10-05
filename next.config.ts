import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/games/tamago-v4/:file*.wasm',
      headers: [{ key: 'Content-Type', value: 'application/wasm' }],
    }]
  },
}

export default withNextIntl(nextConfig)
