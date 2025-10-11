export const POST_STATUS = {
  ONLINE: 1,
  OFFLINE: 0,
  CLOSED: 2
};

export const POST_STATUS_TYPE = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  CLOSE: 'CLOSE'
}

export const LIST_STATUS = [{ id: 1, name: 'online' }, { id: 0, name: 'offline' }];
export const MIN_PRICE = 1.036045

export const QUOTED_MIN_PRICE = {
  VNDT_VCHAIN: MIN_PRICE,
  USDT_POLYGON: 23500,
  USDT_BSC: 23500,
  USDT_ETHEREUM: 23500,
  USDT_TRON: 23500
}

export const POST_REFRESH_OPTIONS = [
  {
    key: 0, title: 'Làm mới ngay', value: 0
  },
  {
    key: 1, title: 'Làm mới mỗi 5s', value: 5000
  },
  {
    key: 2, title: 'Làm mới mỗi 10s', value: 10000
  },
  {
    key: 3, title: 'Làm mới mỗi 30s', value: 30000
  }
]
