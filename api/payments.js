const PAYMENTS_API = {
  CREATE: '/payments/merchant/create-payment-method',
  UPDATE: '/payments/merchant/update-payment-method',
  LIST: '/payments/merchant/list-payment-methods',
  DELETE: id => `/payments/merchant/delete-payment-method/${id}`,
  GET_AVAILABILITY: id => `/payments/merchant/get-payment-method-availability/${id}`,

  USER_CREATE: '/payments/create-payment-method',
  USER_UPDATE: '/payments/update-payment-method',
  USER_LIST: '/payments/list-payment-methods',
  USER_PUBLIC_LIST: '/payments/list-public-payment-methods',
  USER_DELETE: id => `/payments/delete-payment-method/${id}`
}
module.exports = PAYMENTS_API
