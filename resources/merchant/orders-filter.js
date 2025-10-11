export const STATUS_PENDING_ORDER = '1,2,3'
export const STATUS_HISTORY_ORDER = '4,5'
export const LIST_STATUS_BUY_PENDING = [
  {
    name: 'merchant.list_order.order_filter.to_be_paid',
    value: 1
  },
  {
    name: 'merchant.list_order.order_filter.confirm_paid',
    value: 2
  },
  {
    name: 'merchant.list_order.order_filter.paid',
    value: 3
  }
]
export const LIST_STATUS_SELL_PENDING = [
  {
    name: 'common.status.undelivered',
    value: 1
  },
  {
    name: 'common.status.delivered',
    value: 2
  },
  {
    name: 'common.status.confirm',
    value: 3
  }
]

export const LIST_STATUS_HISTORY = [
  {
    name: 'common.status.complete',
    value: 4
  },
  {
    name: 'common.status.cancelled',
    value: 5
  }
]

export const LIST_SORT = [
  {
    name: 'merchant.list_order.order_filter.ascending',
    value: 'ASC'
  },
  {
    name: 'merchant.list_order.order_filter.decrease',
    value: 'DESC'
  }
]

export const LIST_POST_TYPE = [
  {
    name: 'merchant.list_order.order_filter.buy',
    value: 'BUY'
  },
  {
    name: 'merchant.list_order.order_filter.sell',
    value: 'SELL'
  }
]
export const TOP_FILTER = {
  MONEY: {
    name: 'merchant.list_order.order_filter.money',
    id: 'MONEY'
  },
  TRANSFER_CODE: {
    name: 'merchant.list_order.order_filter.trans_code',
    id: 'TRANSFER_CODE'
  }
}

export const AMOUNT_SUGGEST = [
  { name: '1M', value: 1000000 },
  { name: '5M', value: 5000000 },
  { name: '10M', value: 10000000 },
  { name: '50M', value: 50000000 },
  { name: '100M', value: 100000000 },
  { name: '1B', value: 1000000000 }
]
