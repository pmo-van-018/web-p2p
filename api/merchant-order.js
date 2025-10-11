const MERCHANT_ORDER_API = {
  BUY_INFO: (id, viewOnly) => `/order/merchant/get-buy-order-detail/${id}?viewOnly=${viewOnly}`,
  SELL_INFO: (id, viewOnly) => `/order/merchant/get-sell-order-detail/${id}?viewOnly=${viewOnly}`,
  SUBMIT_CRYPTO_TRANSACTION: '/order/merchant/submit-crypto-transaction',
  CONFIRM_PAID: '/order/merchant/confirm-paid',
  CONFIRM_SENT: '/order/merchant/confirm-sent',
  GET_LIST_ORDER: '/order/merchant/list-orders',
  SUPPORTER_PICK: id => `/order/merchant/receive-appeal-order/${id}`,
  SUPPORTER_RESOLVE: id => `/order/merchant/resolve-appeal-order/${id}`,
  TRANSACTION_CRYPTO_STATUS_RPC: id => `/order/merchant/transaction-crypto-status/${id}`,
  SUPPORTER_COUNT_PICKED_ORDER: '/order/merchant/count-picked-order',
  COMPARE_PRICE_STATISTIC: '/order/merchant/compare-price-statistic'
}
module.exports = MERCHANT_ORDER_API
