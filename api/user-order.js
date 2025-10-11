const ORDER_API = {
  BUY_INFO: '/order/get-buy-order-detail',
  GET_LIST_ORDER: '/order/list-orders',
  BUY_CRYPTO: '/order/create-buy-order',
  CANCEL_BUY: '/order/cancel-buy-order',
  CONFIRM_PAYMENT: '/order/confirm-payment',
  SELL_INFO: '/order/get-sell-order-detail',
  SELL_CRYPTO: '/order/create-sell-order',
  CONFIRM_RECEIVED: '/order/confirm-received',
  CANCEL_SELL: '/order/cancel-sell-order',
  SUBMIT_CRYPTO_TRANSACTION: '/order/submit-crypto-transaction',
  SELL_APPEAL: '/order/contact-merchant-sell-order',
  REQUEST_CONFIRMATION_TRANSACTION: '/order/request-confirmation-transaction',
  OPEN_APPEAL_SELL_ORDER: '/appeals/open-appeal-sell-order',
  BUY_APPEAL: '/order/contact-merchant-buy-order',
  OPEN_APPEAL_BUY_ORDER: '/appeals/open-appeal-buy-order'
}
module.exports = ORDER_API
