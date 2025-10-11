export const TRANSFER_INFO = {
  'transfer-to-seller-transfer-info': {
    title: 'transfer_seller.note.transfer_info.title',
    subTitle: 'transfer_seller.note.transfer_info.sub_title',
    countDownText: 'transfer_seller.note.transfer_info.countdown_text',
    status: ''
  },
  'transfer-to-seller-transfer-waiting': {
    title: 'transfer_seller.note.transfer_waiting.title',
    subTitle: 'transfer_seller.note.transfer_waiting.sub_title',
    countDownText: 'transfer_seller.note.transfer_waiting.countdown_text',
    status: ''
  },
  'transfer-to-seller-transfer-waiting-end-time': {
    title: 'transfer_seller.note.transfer_waiting_end_time.title',
    subTitle: 'transfer_seller.note.transfer_waiting_end_time.sub_title',
    countDownText: 'transfer_seller.note.transfer_waiting_end_time.countdown_text',
    status: ''
  },
  'transfer-to-seller-transfer-complain-forever': {
    title: 'transfer_seller.note.transfer_complain_forever.title',
    subTitle: 'transfer_seller.note.transfer_complain_forever.sub_title',
    countDownText: 'transfer_seller.note.transfer_complain_forever.countdown_text',
    status: ''
  },
  'transfer-to-seller-transfer-completed': {
    title: 'transfer_seller.note.transfer_completed.title',
    subTitle: 'transfer_seller.note.transfer_completed.sub_title',
    countDownText: 'transfer_seller.note.transfer_completed.countdown_text',
    status: 'processing'
  },
  'transfer-to-seller-transfer-successful': {
    title: 'transfer_seller.note.transfer_successful.title',
    subTitle: 'transfer_seller.note.transfer_successful.sub_title',
    countDownText: 'transfer_seller.note.transfer_successful.countdown_text',
    status: 'successful'
  },
  'transfer-to-seller-transfer-failed': {
    title: 'transfer_seller.note.transfer_failed.title',
    subTitle: 'transfer_seller.note.transfer_failed.sub_title',
    countDownText: 'transfer_seller.note.transfer_failed.countdown_text',
    status: 'failed'
  },
  'transfer-to-seller-transfer-cancel': {
    title: 'transfer_seller.note.transfer_cancel.title',
    subTitle: 'transfer_seller.note.transfer_cancel.sub_title',
    countDownText: 'transfer_seller.note.transfer_cancel.countdown_text',
    status: 'info'
  },
  'transfer-to-seller-transfer-end-time': {
    title: 'transfer_seller.note.transfer_end_time.title',
    subTitle: 'transfer_seller.note.transfer_end_time.sub_title',
    countDownText: 'transfer_seller.note.transfer_end_time.countdown_text',
    status: 'failed'
  },
  'transfer-to-seller-transfer-complain': {
    title: 'transfer_seller.note.transfer_complain.title',
    subTitle: 'transfer_seller.note.transfer_complain.sub_title',
    countDownText: 'transfer_seller.note.transfer_complain.countdown_text',
    status: 'info'
  },
  'transfer-to-seller-transfer-cancel-system': {
    title: 'transfer_seller.note.transfer_cancel_system.title',
    subTitle: 'transfer_seller.note.transfer_cancel_system.sub_title',
    countDownText: 'transfer_seller.note.transfer_cancel_system.countdown_text',
    status: 'info'
  }
}

export const STEP_1 = {
  BUY_ORDER_CREATED_BY_USER: {},
  BUY_ORDER_CREATED_BY_USER_DEAL_TIME: {},
  SELL_ORDER_CREATED_BY_USER: {},
  SELL_SENDING_CRYPTO_BY_USER: {},
  SELL_SENDING_CRYPTO_FAILED: {}
}

export const STEP_2 = {
  BUY_NOTIFY_SENT_FIAT_BY_USER: {},
  BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME: {},
  BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT: {},
  BUY_CONFIRMED_FIAT_BY_MERCHANT: {},
  BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT: {},
  BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME: {},
  SELL_SENDING_CRYPTO_SUCCESS: {},
  SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME: {}
}

export const STEP_3 = {
  BUY_SENDING_CRYPTO_BY_MERCHANT: {},
  BUY_SENDING_CRYPTO_FAILED: {},
  BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED: {},
  BUY_SENDING_CRYPTO_SUCCESS: {},
  SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME: {},
  SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT: {},
  SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER: {}
}

export const NO_STEP = {
  BUY_SENDING_CRYPTO_SUCCESS: {},
  BUY_ORDER_CANCELLED_BY_USER: {},
  BUY_ORDER_CANCELLED_BY_SYSTEM: {},
  SELL_ORDER_CANCELLED_BY_SYSTEM: {},
  SELL_ORDER_CANCELLED_BY_USER: {},
  SELL_CONFIRMED_FIAT_BY_USER: {}
}

export const STATUS_ORDER_SELL = {
  TO_BE_PAID: {
    value: 1,
    text: 'merchant.transaction_detail.status_sell.to_be_paid',
    name: 'to-be-paid',
    upercaseName: 'TO_BE_PAID'
  },
  CONFIRM_PAID: {
    value: 2,
    text: 'merchant.transaction_detail.status_sell.confirm_paid',
    name: 'confirm-paid',
    upercaseName: 'CONFIRM_PAID'
  },
  PAID: {
    value: 3,
    text: 'merchant.transaction_detail.status_sell.paid',
    name: 'paid',
    upercaseName: 'PAID'
  },
  COMPLETED: {
    value: 4,
    text: 'merchant.transaction_detail.status_sell.completed',
    name: 'completed',
    upercaseName: 'COMPLETED'
  },
  CANCELLED: {
    value: 5,
    text: 'merchant.transaction_detail.status_sell.cancelled',
    name: 'cancelled',
    upercaseName: 'CANCELLED'
  }
}

export const STATUS_ORDER_BUY = {
  TO_BE_PAID: {
    value: 1,
    url: '/transfer-to-seller/transfer-info',
    urlAppeal: '/transfer-to-seller/transfer-end-time',
    text: 'merchant.transaction_detail.status.to_be_paid',
    textSell: 'merchant.transaction_detail.status_sell.to_be_paid',
    name: 'to-be-paid',
    upercaseName: 'TO_BE_PAID',
    merchant: {
      footerDetailText: 'merchant.transaction_detail.footer_desc_4'
    }
  },
  CONFIRM_PAID: {
    value: 2,
    url: '/transfer-to-seller/transfer-waiting',
    text: 'merchant.transaction_detail.status.confirm_paid',
    textSell: 'merchant.transaction_detail.status_sell.confirm_paid',
    name: 'confirm-paid',
    upercaseName: 'CONFIRM_PAID',
    merchant: {
      footerDetailText: 'merchant.transaction_detail.footer_desc_1'
    }
  },
  PAID: {
    value: 3,
    url: '/transfer-to-seller/transfer-waiting',
    text: 'merchant.transaction_detail.status.paid',
    textSell: 'merchant.transaction_detail.status_sell.paid',
    name: 'paid',
    upercaseName: 'PAID',
    merchant: {
      footerDetailText: 'merchant.transaction_detail.footer_desc_2'
    }
  },
  COMPLETED: {
    value: 4,
    url: '/transfer-to-seller/transfer-successful',
    text: 'merchant.transaction_detail.status.completed',
    textSell: 'merchant.transaction_detail.status_sell.completed',
    name: 'completed',
    upercaseName: 'COMPLETED',
    merchant: {
      footerDetailText: ''
    }
  },
  CANCELLED: {
    value: 5,
    url: '/transfer-to-seller/transfer-cancel',
    text: 'merchant.transaction_detail.status.cancelled',
    textSell: 'merchant.transaction_detail.status_sell.cancelled',
    name: 'cancelled',
    upercaseName: 'CANCELLED',
    merchant: {
      footerDetailText: 'merchant.transaction_detail.footer_desc_3'
    }
  }
}

export const ORDER_ACTIONS = {
  CONFIRM_PAYMENT: 'confirm-payment',
  CANCEL_PAYMENT: 'cancel-payment',
  TIMEOUT: 'timeout',
  FINISH: 'finish',
  SEND_CRYPTO: 'send-crypto',
  SEND_CRYPTO_PROCESS: 'send-crypto-process',
  SELL_CONFIRM_PAYMENT: 'sell-confirm-payment',
  CONTACT_ADMIN: 'contact-admin',
  TX_CONFIRM: 'tx-confirm'
}

export const ORDER_BUY_STEP = {
  // Step 1
  BUY_ORDER_CREATED_BY_USER: {
    url: '/transfer-to-seller/transfer-info',
    name: 'BUY_ORDER_CREATED_BY_USER',
    title: 'transfer_seller.note.transfer_info.title',
    subTitle: 'transfer_seller.note.transfer_info.sub_title',
    countDownText: 'transfer_seller.note.transfer_info.countdown_text',
    status: '',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_ORDER_CREATED_BY_USER',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_ORDER_CREATED_BY_USER',
    component: () => import('@/components/desktop/user-order-detail/payment-info'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment-info')
  },
  // Step 2
  BUY_ORDER_CREATED_BY_USER_DEAL_TIME: {
    url: '/transfer-to-seller/transfer-end-time',
    name: 'BUY_ORDER_CREATED_BY_USER_DEAL_TIME',
    title: 'transfer_seller.note.transfer_dealing.title',
    subTitle: 'transfer_seller.note.transfer_dealing.sub_title',
    countDownText: 'transfer_seller.note.transfer_dealing.countdown_text',
    status: '',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_ORDER_CREATED_BY_USER_DEAL_TIME',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_ORDER_CREATED_BY_USER_DEAL_TIME',
    component: () => import('@/components/desktop/user-order-detail/payment-info'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment-info')
  },
  // Step 3
  BUY_NOTIFY_SENT_FIAT_BY_USER: {
    url: '/transfer-to-seller/transfer-waiting',
    name: 'BUY_NOTIFY_SENT_FIAT_BY_USER',
    title: 'transfer_seller.note.transfer_waiting.title',
    subTitle: 'transfer_seller.note.transfer_waiting.sub_title',
    countDownText: 'transfer_seller.note.transfer_waiting.countdown_text',
    status: '',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_NOTIFY_SENT_FIAT_BY_USER',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_NOTIFY_SENT_FIAT_BY_USER',
    component: () => import('@/components/desktop/user-order-detail/payment-info'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment-info')
  },
  // Step 4
  BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME: {
    url: '/transfer-to-seller/transfer-waiting',
    name: 'BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME',
    title: 'transfer_seller.note.transfer_dealing_confirm_paid.title',
    subTitle: 'transfer_seller.note.transfer_dealing_confirm_paid.sub_title',
    countDownText: 'transfer_seller.note.transfer_dealing_confirm_paid.countdown_text',
    status: '',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_ORDER_CREATED_BY_USER_DEAL_TIME',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_ORDER_CREATED_BY_USER_DEAL_TIME',
    component: () => import('@/components/desktop/user-order-detail/payment-info'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment-info')
  },
  // Step 5
  BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT: {
    url: '/transfer-to-seller/transfer-waiting-end-time',
    name: 'BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT',
    title: 'transfer_seller.note.transfer_waiting_end_time.title',
    subTitle: 'transfer_seller.note.transfer_waiting_end_time.sub_title',
    countDownText: 'transfer_seller.note.transfer_waiting_end_time.countdown_text',
    status: '',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT',
    component: () => import('@/components/desktop/user-order-detail/payment-info'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment-info')
  },
  // Step 6
  BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT: {
    url: '/transfer-to-seller/transfer-waiting',
    name: 'BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT',
    title: 'transfer_seller.note.transfer_requested_support.title',
    subTitle: 'transfer_seller.note.transfer_requested_support.sub_title',
    countDownText: 'transfer_seller.note.transfer_requested_support.countdown_text',
    status: '',
    descriptionForMerchant: '',
    descriptionDetailForMerchant: '',
    component: () => import('@/components/desktop/user-order-detail/payment-info'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment-info')
  },
  // Step 7
  BUY_CONFIRMED_FIAT_BY_MERCHANT: {
    url: '/transfer-to-seller/merchant-confirm-fiat',
    name: 'BUY_CONFIRMED_FIAT_BY_MERCHANT',
    title: 'transfer_seller.note.transfer_waiting_end_time.title',
    subTitle: 'transfer_seller.note.transfer_waiting_end_time.sub_title',
    countDownText: 'transfer_seller.note.transfer_waiting_end_time.countdown_text',
    status: '',
    descriptionForMerchant: '',
    descriptionDetailForMerchant: '',
    component: () => import('@/components/desktop/user-order-detail/payment-confirmation'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment-confirmation')
  },
  BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME: {
    url: '',
    name: 'BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME',
    title: 'transfer_seller.note.transfer_dealing_confirm_paid.title',
    subTitle: 'transfer_seller.note.transfer_dealing_confirm_paid.sub_title',
    countDownText: 'transfer_seller.note.transfer_dealing_confirm_paid.countdown_text',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_SENT_FIAT_APPEAL_BY_USER',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_SENT_FIAT_APPEAL_BY_USER',
    component: () => import('@/components/desktop/user-order-detail/payment-confirmation'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment-confirmation')
  },
  BUY_SENDING_CRYPTO_BY_MERCHANT: {
    url: '/transfer-to-seller/transfer-completed',
    name: 'BUY_SENDING_CRYPTO_BY_MERCHANT',
    title: 'transfer_seller.note.transfer_completed.title',
    subTitle: 'transfer_seller.note.transfer_completed.sub_title',
    countDownText: 'transfer_seller.note.transfer_completed.countdown_text',
    status: 'processing',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_SENDING_CRYPTO_BY_MERCHANT',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_SENDING_CRYPTO_BY_MERCHANT',
    component: () => import('@/components/desktop/user-order-detail/payment'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment')
  },
  BUY_SENDING_CRYPTO_SUCCESS: {
    url: '/transfer-to-seller/transfer-successful',
    name: 'BUY_SENDING_CRYPTO_SUCCESS',
    title: 'transfer_seller.note.transfer_successful.title',
    subTitle: 'transfer_seller.note.transfer_successful.sub_title',
    countDownText: 'transfer_seller.note.transfer_successful.countdown_text',
    status: 'successful',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_SENDING_CRYPTO_SUCCESS',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_SENDING_CRYPTO_SUCCESS',
    component: () => import('@/components/desktop/user-order-detail/completion'),
    componentMobile: () => import('@/components/mobile/user-order-detail/completion')
  },
  BUY_SENDING_CRYPTO_FAILED: {
    url: '/transfer-to-seller/transfer-failed',
    name: 'BUY_SENDING_CRYPTO_FAILED',
    title: 'transfer_seller.note.transfer_failed.title',
    subTitle: 'transfer_seller.note.transfer_failed.sub_title',
    countDownText: 'transfer_seller.note.transfer_failed.countdown_text',
    status: 'failed',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_SENDING_CRYPTO_FAILED',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_SENDING_CRYPTO_FAILED',
    component: () => import('@/components/desktop/user-order-detail/payment'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment')
  },
  BUY_ORDER_CANCELLED_BY_USER: {
    url: '/transfer-to-seller/transfer-cancel',
    name: 'BUY_ORDER_CANCELLED_BY_USER',
    title: 'transfer_seller.note.transfer_cancel.title',
    subTitle: 'transfer_seller.note.transfer_cancel.sub_title',
    countDownText: 'transfer_seller.note.transfer_cancel.countdown_text',
    status: 'info',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_ORDER_CANCELLED_BY_USER',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_ORDER_CANCELLED_BY_USER',
    component: () => import('@/components/desktop/user-order-detail/cancellation'),
    componentMobile: () => import('@/components/mobile/user-order-detail/cancellation')
  },
  BUY_ORDER_CANCELLED_BY_SYSTEM: {
    url: '/transfer-to-seller/transfer-cancel-system',
    name: 'BUY_ORDER_CANCELLED_BY_SYSTEM',
    title: 'transfer_seller.note.transfer_cancel_system.title',
    subTitle: 'transfer_seller.note.transfer_cancel_system.sub_title',
    countDownText: 'transfer_seller.note.transfer_cancel_system.countdown_text',
    status: 'info',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_ORDER_CANCELLED_BY_SYSTEM',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_ORDER_CANCELLED_BY_SYSTEM',
    component: () => import('@/components/desktop/user-order-detail/cancellation'),
    componentMobile: () => import('@/components/mobile/user-order-detail/cancellation')
  },
  BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED: {
    url: '',
    name: 'BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED',
    title: 'transfer_seller.note.transfer_requested_support.title',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED',
    status: 'failed',
    component: () => import('@/components/desktop/user-order-detail/payment'),
    componentMobile: () => import('@/components/mobile/user-order-detail/payment')
  }
}

export const ORDER_SELL_STEP = {
  SELL_ORDER_CREATED_BY_USER: {
    name: 'SELL_ORDER_CREATED_BY_USER',
    title: 'end_user_sell.note.transfer_info.title',
    subTitle: 'end_user_sell.note.transfer_info.sub_title',
    countDownText: 'end_user_sell.note.transfer_info.countdown_text',
    status: '',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_ORDER_CREATED_BY_USER',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_ORDER_CREATED_BY_USER',
    component: () => import('@/components/desktop/user-order-detail/sell-payment-info'),
    componentMobile: () => import('@/components/mobile/user-order-detail/sell-payment-info')
  },
  SELL_SENDING_CRYPTO_BY_USER: {
    name: 'SELL_SENDING_CRYPTO_BY_USER',
    title: 'end_user_sell.note.transfer_info.title',
    subTitle: 'end_user_sell.note.transfer_info.sub_title',
    countDownText: 'end_user_sell.note.transfer_info.countdown_text',
    status: 'processing',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_SENDING_CRYPTO_BY_USER',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_SENDING_CRYPTO_BY_USER',
    component: () => import('@/components/desktop/user-order-detail/sell-payment-info'),
    componentMobile: () => import('@/components/mobile/user-order-detail/sell-payment-info')
  },
  SELL_SENDING_CRYPTO_FAILED: {
    name: 'SELL_SENDING_CRYPTO_FAILED',
    title: 'end_user_sell.note.transfer_info.title',
    subTitle: 'end_user_sell.note.transfer_info.sub_title',
    countDownText: 'end_user_sell.note.transfer_info.countdown_text',
    status: 'failed',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_SENDING_CRYPTO_FAILED',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_SENDING_CRYPTO_FAILED',
    component: () => import('@/components/desktop/user-order-detail/sell-payment-info'),
    componentMobile: () => import('@/components/mobile/user-order-detail/sell-payment-info')
  },
  SELL_SENDING_CRYPTO_SUCCESS: {
    name: 'SELL_SENDING_CRYPTO_SUCCESS',
    title: 'end_user_sell.note.transfer_info.title',
    subTitle: 'end_user_sell.note.transfer_info.sub_title',
    countDownText: 'end_user_sell.note.transfer_info.countdown_text',
    status: 'successful',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_SENDING_CRYPTO_SUCCESS',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_SENDING_CRYPTO_SUCCESS',
    component: () => import('@/components/desktop/user-order-detail/sell-payment'),
    componentMobile: () => import('@/components/mobile/user-order-detail/sell-payment')
  },
  SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME: {
    name: 'SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME',
    title: 'end_user_sell.note.transfer_info.title',
    subTitle: 'end_user_sell.note.transfer_info.sub_title',
    countDownText: 'end_user_sell.note.transfer_info.countdown_text',
    status: 'successful',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_ENABLE_APPEAL_MERCHANT_NOT_SENDING_FIAT',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_ENABLE_APPEAL_MERCHANT_NOT_SENDING_FIAT',
    component: () => import('@/components/desktop/user-order-detail/sell-payment'),
    componentMobile: () => import('@/components/mobile/user-order-detail/sell-payment')
  },
  SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME: {
    name: 'SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME',
    title: 'end_user_sell.note.transfer_info.title',
    subTitle: 'end_user_sell.note.transfer_info.sub_title',
    countDownText: 'end_user_sell.note.transfer_info.countdown_text',
    status: '',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_ENABLE_APPEAL_MERCHANT_NOT_SENDING_FIAT',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_ENABLE_APPEAL_MERCHANT_NOT_SENDING_FIAT',
    component: () => import('@/components/desktop/user-order-detail/sell-payment'),
    componentMobile: () => import('@/components/mobile/user-order-detail/sell-payment')
  },
  SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT: {
    name: 'SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT',
    title: 'end_user_sell.note.transfer_info.title',
    subTitle: 'end_user_sell.note.transfer_info.sub_title',
    countDownText: 'end_user_sell.note.transfer_info.countdown_text',
    status: '',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_ENABLE_APPEAL_MERCHANT_NOT_SENDING_FIAT',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_ENABLE_APPEAL_MERCHANT_NOT_SENDING_FIAT',
    component: () => import('@/components/desktop/user-order-detail/sell-payment'),
    componentMobile: () => import('@/components/mobile/user-order-detail/sell-payment')
  },
  SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER: {
    name: 'SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER',
    title: 'end_user_sell.note.transfer_info.title',
    subTitle: 'end_user_sell.note.transfer_info.sub_title',
    countDownText: 'end_user_sell.note.transfer_info.countdown_text',
    status: '',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_ENABLE_APPEAL_MERCHANT_NOT_SENDING_FIAT',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_ENABLE_APPEAL_MERCHANT_NOT_SENDING_FIAT',
    component: () => import('@/components/desktop/user-order-detail/sell-payment'),
    componentMobile: () => import('@/components/mobile/user-order-detail/sell-payment')
  },
  SELL_ORDER_CANCELLED_BY_USER: {
    name: 'SELL_ORDER_CANCELLED_BY_USER',
    title: 'end_user_sell.note.transfer_cancel.title',
    subTitle: 'transfer_seller.note.transfer_cancel.sub_title',
    countDownText: 'transfer_seller.note.transfer_cancel.countdown_text',
    status: 'info',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_ORDER_CANCELLED_BY_USER',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_ORDER_CANCELLED_BY_USER',
    component: () => import('@/components/desktop/user-order-detail/cancellation'),
    componentMobile: () => import('@/components/mobile/user-order-detail/cancellation')
  },
  SELL_ORDER_CANCELLED_BY_SYSTEM: {
    name: 'BUY_ORDER_CANCELLED_BY_SYSTEM',
    title: 'transfer_seller.note.transfer_cancel_system.title',
    subTitle: 'transfer_seller.note.transfer_cancel_system.sub_title',
    countDownText: 'transfer_seller.note.transfer_cancel_system.countdown_text',
    status: 'info',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_ORDER_CANCELLED_BY_SYSTEM',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_ORDER_CANCELLED_BY_SYSTEM',
    component: () => import('@/components/desktop/user-order-detail/cancellation'),
    componentMobile: () => import('@/components/mobile/user-order-detail/cancellation')
  },
  SELL_CONFIRMED_FIAT_BY_USER: {
    name: 'SELL_CONFIRMED_FIAT_BY_USER',
    title: 'transfer_seller.note.transfer_successful.title',
    subTitle: 'transfer_seller.note.transfer_successful.sub_title',
    countDownText: 'transfer_seller.note.transfer_successful.countdown_text',
    status: 'successful',
    descriptionForMerchant: 'merchant.list_order.descriptionMerchant.SELL_CONFIRMED_FIAT_BY_USER',
    descriptionDetailForMerchant: 'merchant.list_order.descriptionDetailMerchant.SELL_CONFIRMED_FIAT_BY_USER',
    component: () => import('@/components/desktop/user-order-detail/completion'),
    componentMobile: () => import('@/components/mobile/user-order-detail/completion')
  }
}
