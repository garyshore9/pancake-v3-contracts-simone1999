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

const xdc: NetworkUserConfig = {
  url: 'https://erpc.xdcrpc.com',
  chainId: 50,
  accounts: [process.env.KEY_XDC!],
}

export const networks = {
  hardhat: {
    allowUnlimitedContractSize: true,
  },
  ...(process.env.KEY_CORE && { core }),
  ...(process.env.KEY_XDC && { xdc }),
}