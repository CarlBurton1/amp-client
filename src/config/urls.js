import * as env from './environment.js'

export const ENGINE_HTTP_URL = env.ENGINE_HTTP_URL
export const ENGINE_WS_URL = env.ENGINE_WS_URL
export const ETHEREUM_NODE_HTTP_URL = env.ETHEREUM_NODE_HTTP_URL
export const ETHEREUM_NODE_WS_URL = env.ETHEREUM_NODE_WS_URL


export const EXCHANGE_RATE_API_URL = "/rates"
export const DISCORD_URL = 'https://discordapp.com/invite/eChaHFk'
// export const EXCHANGE_RATE_API_URL = 'https://min-api.cryptocompare.com'

const ETHERSCAN_RINKEBY_TX = 'https://rinkeby.etherscan.io/tx'
const ETHERSCAN_MAINNET_TX = 'https://etherscan.io/tx'

const ETHERSCAN_RINKEBY_TOKEN = 'https://rinkeby.etherscan.io/token'
const ETHERSCAN_MAINNET_TOKEN = 'https://etherscan.io/token'

const ETHERSCAN_RINKEBY_ADDRESS = 'https://rinkeby.etherscan.io/address'
const ETHERSCAN_MAINNET_ADDRESS = 'https://etherscan.io/address'


export const ETHERSCAN_TX_URL = { '4': ETHERSCAN_RINKEBY_TX, '1': ETHERSCAN_MAINNET_TX }[env.DEFAULT_NETWORK_ID]
export const ETHERSCAN_TOKEN_URL = { '4': ETHERSCAN_RINKEBY_TOKEN, '1': ETHERSCAN_MAINNET_TOKEN }[env.DEFAULT_NETWORK_ID]
export const ETHERSCAN_ADDRESS_URL = { '4': ETHERSCAN_RINKEBY_ADDRESS, '1': ETHERSCAN_MAINNET_ADDRESS }[env.DEFAULT_NETWORK_ID]




