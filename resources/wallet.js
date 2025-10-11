export const STATUS = { FAIL: 'fail', SUCCESS: 'success' }

export const STATUS_CONNECT_WALLET = {
  [STATUS.FAIL]: {
    icon: 'icon-cancel',
    title: 'modal.connect_wallet.title_failed'
  },
  [STATUS.SUCCESS]: {
    icon: 'icon-connective',
    title: 'modal.connect_wallet.title_successed'
  }
};

export const CONNECT_WALLET_IMG = {
  p2p_app: '/assets/images/components/desktop/modal/wallet/p2p-img.png',
  wallet: '/assets/images/components/desktop/modal/wallet/wallet-img.png',
  metamask: '/assets/images/components/desktop/modal/wallet/metamask-img.png',
  wallet_connect: '/assets/images/components/desktop/modal/wallet/wallet-connect.png'
};

export const NETWORK_CONFIGS = {
  VChain: {
    chainName: 'VChain',
    iconNetwork: '/assets/images/common/networks/vchain.png',
    nativeCurrency: {
      symbol: 'VNDT',
      name: 'VNDT',
      decimals: 18
    }
  },
  Polygon: {
    chainName: 'Matic Mainnet',
    iconNetwork: '/assets/images/common/networks/polygon.png',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    }
  },
  BSC: {
    chainName: 'BSC Mainnet',
    iconNetwork: '/assets/images/common/networks/bsc.png',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    }
  },
  Tron: {
    chainName: 'Tron',
    iconNetwork: '/assets/images/common/networks/tron.svg',
    nativeCurrency: {
      name: 'TRX',
      symbol: 'TRX',
      decimals: 6
    }
  },
  KDONG: {
    chainName: 'KDONG',
    iconNetwork: '/assets/images/common/networks/polygon.png',
    nativeCurrency: {
      name: 'KDONG',
      symbol: 'KDG',
      decimals: 18
    }
  }
}

export const V99_WALLET = {
  label: 'V99'
}

export const ASSET_COIN_IMAGES = {
  VNDT_VCHAIN: '/assets/images/common/vndt.svg',
  VIC_BSC: '/assets/images/common/vic-bsc.svg',
  USDT_POLYGON: '/assets/images/common/usdt-poly.svg',
  VIC_POLYGON: '/assets/images/common/vic-poly.svg',
  USDT_BSC: '/assets/images/common/usdt-bsc.svg',
  USDT_ETHEREUM: '/assets/images/common/usdt-eth.svg',
  USDT_TRON: '/assets/images/common/usdt-tron.svg',
  KDG_KDONG: '/assets/images/common/kdg-kdong.svg'
}
