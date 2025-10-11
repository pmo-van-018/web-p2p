export const NETWORK_OPTIONS = [
  {
    name: 'Polygon',
    value: 'Polygon',
    icon: '/assets/images/common/asset-network/polygon.svg'
  },
  {
    name: 'BSC',
    value: 'BSC',
    icon: '/assets/images/common/asset-network/bsc.svg'
  },
  {
    name: 'Tron',
    value: 'Tron',
    icon: '/assets/images/common/asset-network/tron.svg'
  },
  {
    name: 'KDONG',
    value: 'KDONG',
    icon: '/assets/images/common/asset-network/kdong.svg'
  }
]
export const WALLET_SUPPORTED = {
  METAMASK: 'METAMASK',
  TRUSTWALLET: 'TRUSTWALLET',
  BINANCE: 'BINANCE',
  COINBASE: 'COINBASE',
  TRONLINK: 'TRONLINK',
  WALLETCONNECT: 'WALLETCONNECT'
}
export const WALLET_FORMATTED_SUPPORTED = {
  [WALLET_SUPPORTED.METAMASK]: 'Metamask',
  [WALLET_SUPPORTED.TRUSTWALLET]: 'Trust',
  [WALLET_SUPPORTED.COINBASE]: 'Coinbase',
  [WALLET_SUPPORTED.TRONLINK]: 'TronLink',
  [WALLET_SUPPORTED.BINANCE]: 'Binance Defi',
  [WALLET_SUPPORTED.WALLETCONNECT]: 'WalletConnect'
}
export const WALLET_OPTIONS = [
  {
    name: WALLET_FORMATTED_SUPPORTED.METAMASK,
    value: WALLET_SUPPORTED.METAMASK,
    icon: '/assets/images/common/wallet/metamask.svg'
  },
  {
    name: WALLET_FORMATTED_SUPPORTED.TRUSTWALLET,
    value: WALLET_SUPPORTED.TRUSTWALLET,
    icon: '/assets/images/common/wallet/trust.svg'
  },
  {
    name: WALLET_FORMATTED_SUPPORTED.BINANCE,
    value: WALLET_SUPPORTED.BINANCE,
    icon: '/assets/images/common/wallet/binance.svg'
  },
  {
    name: WALLET_FORMATTED_SUPPORTED.COINBASE,
    value: WALLET_SUPPORTED.COINBASE,
    icon: '/assets/images/common/wallet/coinbase.svg'
  },
  {
    name: WALLET_FORMATTED_SUPPORTED.TRONLINK,
    value: WALLET_SUPPORTED.TRONLINK,
    icon: '/assets/images/common/wallet/tron.svg'
  },
  {
    name: WALLET_FORMATTED_SUPPORTED.WALLETCONNECT,
    value: WALLET_SUPPORTED.WALLETCONNECT,
    icon: '/assets/images/common/wallet/walletconnect.svg'
  }
]
