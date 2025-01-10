import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, bsc, avalanche } from '@reown/appkit/networks'

// 1. Get projectId from https://cloud.reown.com
const projectId = 'bd9f15cbf71849a70415487e71be2bf9'

// 2. Create your application's metadata object
const metadata = {
  name: 'ChoccySwap',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

// 3. Create a AppKit instance
const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [mainnet, bsc, avalanche],
  metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})