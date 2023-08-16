require('dotenv').config({ path: require('find-config')('.env') })

interface NetworkUserConfig {
  url: string;
  chainId: number;
  accounts: string[]
}

const core: NetworkUserConfig = {
  url: 'https://rpc-core.icecreamswap.com',
  chainId: 1116,
  accounts: [process.env.KEY_CORE!],
}

export const networks = {
  hardhat: {
    allowUnlimitedContractSize: true,
  },
  ...(process.env.KEY_CORE && { core }),
}