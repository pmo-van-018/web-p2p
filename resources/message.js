export const ERROR_TYPE = {
  SYSTEM: 'system',
  MANUAL: 'manual'
}

export const ERROR_MESSAGE = {
  USER_IS_BLOCKED: 'USER_IS_BLOCKED',
  OPERATION_IS_BLOCKED: 'OPERATION_IS_BLOCKED'
};

export const ERROR_MESSAGE_ICON = {
  CANNOT_DISABLE_OPERATOR_HAS_PENDING_ORDER: 'operation/staff-inactive-failed',
  CANNOT_DISABLE_SUPPORTER_HAS_PENDING_ORDER: 'operation/staff-inactive-failed',
  CANNOT_DISABLE_MANAGER_HAS_PENDING_ORDER: 'operation/staff-inactive-failed',
  PAYMENT_METHOD_HAS_REACH_LIMIT: 'max-10-methods',
  ADMIN_SUPPORTER_VIEW_APPEAL_PERMISSION_DENIED: 'orders/cancelled-appeal-error',
  ADMIN_SUPPORTER_VIEW_SUPPORT_REQUEST_PERMISSION_DENIED: 'customer-care/error/permission-denied',
  SUPPORT_REQUEST_ALREADY_RECEIVED: 'customer-care/error/another-picked',
  TOTAL_REQUEST_PICKED_LIMITS_ARE_EXCEEDED: 'customer-care/error/limit-exceeded'
}

export const ERROR_TITLE = {
  ADMIN_SUPPORTER_VIEW_SUPPORT_REQUEST_PERMISSION_DENIED: 'system_notification',
  SUPPORT_REQUEST_ALREADY_RECEIVED: 'system_notification',
  TOTAL_REQUEST_PICKED_LIMITS_ARE_EXCEEDED: 'system_notification'
}

export const ERROR_NAME = {
  '/user-order/show-buy-info': 'get_buy_info_failed',
  '/user-order/list': 'get_list_order_failed',
  '/user-order/buy-crypto': 'create_buy_failed',
  '/user-order/cancel-buy': 'cancel_buy_failed',
  '/user-order/confirm-payment': 'confirm_buy_failed',
  'connect-wallet': 'connect_wallet',
  '/user-order/show-sell-info': 'get_sell_info_failed',
  '/user-order/sell-crypto': 'create_sell_failed',
  '/user-order/confirm-received': 'confirm_received_failed',
  '/user-order/cancel-sell': 'cancel_sell_failed',
  '/user-order/submit-crypto-transaction': 'submit_crypto_transaction_failed',
  '/user/create-payment-method': 'payment_create_failed',
  '/user/update-payment-method': 'payment_update_failed',
  '/payments/delete': 'payment_delete_failed',
  '/payments': 'get_list_payment_failed',
  '/payments/detail': 'get_detail_payment_failed',
  '/merchant-postings/create': 'merchant_postings_create_failed',
  '/merchant-postings/update': 'merchant_postings_update_failed',
  '/merchant-postings/detail': 'get_detail_postings_failed',
  '/merchant-postings': 'get_list_postings_failed',
  'not-enough-balance': 'not_enough_balance',
  'invalid-network': 'invalid_network',
  'incorrect-from-wallet': 'incorrect_from_wallet',
  'session-expire': 'session_expire',
  'not-pick-order': 'not_pick_order',
  '/admin/inactive-manager': 'system_failed',
  '/operation/inactive-staff': 'system_failed'
};

// Define URLs which don't need to show error popup in global config
export const SKIP_GLOBAL_ERROR_POPUP_URLS = [
  {
    method: 'GET',
    path: '/users/info',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/profile/admin/create-manager',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/profile/system-admin/create-super-admin',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/admin/decide-buy-appeal-result',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/admin/decide-sell-appeal-result',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/admin/add-extra-time-appeal',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/admin/add-extra-time-appeal',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/master-data/admin/update-maintenance',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/referral/submit-code',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/profile/admin/create-admin-supporter',
    pathPattern: null
  },
  {
    method: 'GET',
    path: '/operation/dashboard/chart',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/operation/create-payment-method',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/user/create-payment-method',
    pathPattern: null
  },
  {
    method: 'PUT',
    path: '/operation/update-payment-method',
    pathPattern: null
  },
  {
    method: 'PUT',
    path: '/user/update-payment-method',
    pathPattern: null
  },
  {
    method: 'DELETE',
    path: null,
    pathPattern: /^\/operation\/delete-payment-method\/[0-9]*/
  },
  {
    method: 'DELETE',
    path: null,
    pathPattern: /^\/user\/delete-payment-method\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/admin\/update-admin-supporter\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/admin\/active-admin-supporter\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/admin\/receive-support-request\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/admin\/resolve-support-request\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/admin\/inactive-admin-supporter\/[0-9]*/
  },
  {
    method: 'DELETE',
    path: null,
    pathPattern: /^\/admin\/delete-admin-supporter\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/operation\/admin\/update-manager\/[0-9]*/
  },
  {
    method: 'DELETE',
    path: null,
    pathPattern: /^\/admin\/delete-manager\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/operation\/admin\/update-staff\/[0-9]*/
  },
  {
    method: 'POST',
    path: '/profile/merchant/create-staff',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/operation/create-post',
    pathPattern: null
  },
  {
    method: 'PUT',
    path: '/operation/update-post',
    pathPattern: null
  },
  {
    method: 'PUT',
    path: '/manager/update-post',
    pathPattern: null
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/operation\/update-post-status\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/manager\/update-post-status\/[0-9]*/
  },
  {
    method: 'DELETE',
    path: null,
    pathPattern: /^\/delete-wallet-address\/[0-9]*/
  },
  {
    method: 'POST',
    path: '/add-wallet-address',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/admin/add-wallet-address',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/blacklist/admin/add-address',
    pathPattern: null
  },
  {
    method: 'DELETE',
    path: null,
    pathPattern: /^\/admin\/blacklist\/delete-address\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/active-wallet-address\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/admin\/delete-wallet-address\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/admin\/active-wallet-address\/[0-9]*/
  },
  {
    method: 'GET',
    path: null,
    pathPattern: /^\/operation\/get-posts-by-payment\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/operation\/update-staff\/[0-9]*/
  },
  {
    method: 'DELETE',
    path: null,
    pathPattern: /^\/operation\/delete-staff\/[0-9]*/
  },
  {
    method: 'GET',
    path: null,
    pathPattern: /^\/user\/show-sell-order-info\/[0-9]*/
  },
  {
    method: 'GET',
    path: null,
    pathPattern: /^\/user\/show-buy-order-info\/[0-9]*/
  },
  {
    method: 'GET',
    path: null,
    pathPattern: /^\/rooms\/\w+\/signed-cookie$/
  },
  {
    method: 'GET',
    path: null,
    pathPattern: /^\/admin\/rooms\/\w+\/signed-cookie$/
  },
  {
    method: 'GET',
    path: '/operation/list-orders',
    pathPattern: null
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/inactive-staff\/[0-9]*/
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/admin\/inactive-manager\/[0-9]*/
  },
  {
    method: 'DELETE',
    path: null,
    pathPattern: /^\/operation\/delete-staff\/[0-9]*/
  },
  {
    method: 'DELETE',
    path: null,
    pathPattern: /^\/admin\/delete-manager\/[0-9]*/
  },
  {
    method: 'POST',
    path: null,
    pathPattern: /^\/admin\/cancel-appeal-session\/[0-9]*/
  },
  {
    method: 'POST',
    path: null,
    pathPattern: /^\/admin\/pick-appeal\/[0-9]*/
  },
  {
    method: 'GET',
    path: null,
    pathPattern: /^\/admin\/show-support-request\/[0-9]*/
  },
  {
    method: 'GET',
    path: null,
    pathPattern: /^\/operation\/dashboard\/trading-volume-by-period/
  },
  {
    method: 'GET',
    path: '/status/check',
    pathPattern: null
  },
  {
    method: 'PUT',
    path: '/operation/update-avatar',
    pathPattern: null
  },
  {
    method: 'PUT',
    path: '/shifts/manager/approve-shifts',
    pathPattern: null
  },
  {
    method: 'PUT',
    path: 'null',
    pathPattern: /^\/shifts\/manager\/approve-shift\/[0-9]*/
  },
  {
    method: 'POST',
    path: '/shifts/merchant/check-in',
    pathPattern: null
  },
  {
    method: 'POST',
    path: '/shifts/merchant/check-out',
    pathPattern: null
  },
  {
    method: 'PUT',
    path: null,
    pathPattern: /^\/operation\/receive-appeal-order\/[0-9]*/
  }
];

export const RESPONSE_ICON = {
  CONNECT_ERROR_WALLET: '/assets/images/common/response/connect-error-wallet.svg',
  CONNECT_SUCCEED_WALLET: '/assets/images/common/response/connect-succeed-wallet.svg',
  CONNECT_EXPIRED_WALLET: '/assets/images/common/response/expired-connect.svg',
  SWITCH_NETWORK: '/assets/images/common/response/switch-network.svg',
  POST_FAILED: '/assets/images/common/post/adv-failed.svg',
  CHOOSE_TIME_FAILED: '/assets/images/common/orders/choose-time-error.svg',
  RESPONSE_FAILED: '/assets/images/common/response-fail.svg',
  CANCELLED_APPEAL_FAILED: '/assets/images/common/orders/cancelled-appeal-error.svg',
  NOT_ALLOWED_APPEAL: '/assets/images/common/orders/not-allowed-appeal.svg',
  NOT_ALLOWED_SUPPORT: '/assets/images/common/customer-request/not-allow-support.svg',
  SWITCH_STATUS_FAILED: '/assets/images/common/orders/switch-status-failed.svg',
  STAFF_INACTIVE_FAILED: '/assets/images/common/operation/staff-inactive-failed.svg',
  SUPPER_ADMIN_FAILED: '/assets/images/common/operation/supper-admin-failed.svg',
  APPEAL_PROCEED: '/assets/images/common/orders/appeal-processed.svg',
  UPDATE_SUPPORT_REQUEST_SUCCEED: '/assets/images/common/customer-request/response-succeed-status.svg',
  UPDATE_SUPPORT_REQUEST_FAILED: '/assets/images/common/customer-request/response-failed-status.svg',
  SUPPORT_PROCEED: '/assets/images/common/customer-request/support-proceed.svg',
  UPDATE_WALLET_FAILED: '/assets/images/common/wallets/delete-wallet-address-failed.svg',
  NOT_ALLOWED_ACTIVE_WALLET_ADDRESS: '/assets/images/common/wallets/not-allow-active-wallet.svg',
  MANAGER_FAILED: '/assets/images/common/operation/manager-failed.svg',
  ADD_WALLET_FAILED: '/assets/images/common/wallets/wallet-failed.svg',
  ADD_WALLET_SUCCEED: '/assets/images/common/wallets/wallet-succeed.svg',
  DELETE_WALLET_SUCCEED: '/assets/images/common/wallets/delete-wallet-succeed.svg',
  DELETE_WALLET_FAILED: '/assets/images/common/wallets/delete-wallet-failed.svg',
  PAYMENT_METHOD_FAILED: '/assets/images/common/method/payment-failed.svg',
  DELETE_PAYMENT_METHOD_FAILED: '/assets/images/common/method/delete-payment-failed.svg',
  PAYMENT_METHOD_NOT_ALLOWED: '/assets/images/common/method/not-allow-payment-added.svg',
  PAYMENT_METHOD_HAS_REACH_LIMIT: '/assets/images/common/method/maximum-payment.svg',
  ADD_BLACK_LIST_SUCCESS: '/assets/images/common/blacklist/add-blacklist-success.svg',
  ADD_BLACK_LIST_FAILED: '/assets/images/common/blacklist/add-blacklist-failed.svg',
  REMOVE_BLACK_LIST_SUCCESS: '/assets/images/common/blacklist/remove-blacklist-success.svg',
  REMOVE_BLACK_LIST_FAILED: '/assets/images/common/blacklist/remove-blacklist-failed.svg',
  SETUP_2FA_SUCCESS: '/assets/images/components/desktop/modal/2fa/success-2fa.svg',
  SETUP_2FA_FAIL: '/assets/images/components/desktop/modal/2fa/fail-2fa.svg',
  SETTING_SET_MAINTENANCE_SYSTEM_SUCCESS: '/assets/images/components/desktop/maintenance/succeed.svg',
  SETTING_SET_MAINTENANCE_SYSTEM_FAILED: '/assets/images/components/desktop/maintenance/failed.svg',
  GASLESS_SUCCEED: '/assets/images/components/desktop/gasless/succeed.svg',
  GASLESS_FAILED: '/assets/images/components/desktop/gasless/failed.svg',
  TOO_MANY_REQUEST: '/assets/images/common/alert/too-many-request.svg',
  UPLOAD_IMAGE_SUCCESS: '/assets/images/common/response/upload_image_success.svg',
  UPDATE_RATE_SUCCESS: '/assets/images/common/response/response-success.svg',
  UPDATE_RATE_FAILED: '/assets/images/common/response/response-failed.svg'
}

export const CONFIRM_TYPE = {
  LOGOUT: 'logout',
  LOGOUT_USERNAME_PASSWORD: 'logoutUsernamePassword',
  CLOSE: 'close',
  REDIRECT_APPEAL_LIST_SUPPORTER: 'redirectAppealListSupporter',
  REDIRECT_APPEAL_LIST: 'redirectAppealList',
  REDIRECT_SUPPORT_REQUEST_LIST: 'redirectSupportRequestList'
}
