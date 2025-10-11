export const REQUEST_TYPE_CODES = {
  PAYMENT: 1,
  ORDER: 2,
  APPEAL: 3,
  MANAGER_REGISTRATION: 4,
  SYSTEM: 5,
  OTHER: 6
}
export const REQUEST_TYPE = [
  { value: REQUEST_TYPE_CODES.PAYMENT, text: 'customer_care.request_type.payment', img: 'customer-care-payment' },
  { value: REQUEST_TYPE_CODES.ORDER, text: 'customer_care.request_type.order', img: 'customer-care-order' },
  { value: REQUEST_TYPE_CODES.APPEAL, text: 'customer_care.request_type.appeal', img: 'customer-care-appeal' },
  { value: REQUEST_TYPE_CODES.MANAGER_REGISTRATION, text: 'customer_care.request_type.manager_registration', img: 'manager-registration' },
  { value: REQUEST_TYPE_CODES.SYSTEM, text: 'customer_care.request_type.system', img: 'customer-care-system' },
  { value: REQUEST_TYPE_CODES.OTHER, text: 'customer_care.request_type.other', img: 'customer-care-other' }
]
