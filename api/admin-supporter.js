const ADMIN_SUPPORTER_API = {
  LIST_ADMIN_SUPPORTER: '/profile/admin/list-admin-supporter',
  CREATE_ADMIN_SUPPORTER: '/profile/admin/create-admin-supporter',
  UPDATE_ADMIN_SUPPORTER_BY_ID: id => `/profile/admin/update-admin-supporter/${id}`,
  ACTIVE_ADMIN_SUPPORTER_BY_ID: id => `/profile/admin/active-admin-supporter/${id}`,
  INACTIVE_ADMIN_SUPPORTER_BY_ID: id => `/profile/admin/inactive-admin-supporter/${id}`,
  ACCOUNT_BY_ID: id => `/profile/admin/delete-admin-supporter/${id}`,
  // support request
  SHOW_SUPPORT_REQUEST_BY_ID: id => `/support-requests/admin/get-request/${id}`,
  LIST_SUPPORT_REQUESTS: '/support-requests/admin/get-requests',
  COUNT_PENDING_SUPPORT_REQUESTS: '/support-requests/admin/count-pending-requests',
  COUNT_SUPPORT_REQUESTS_RECEIVED: '/support-requests/admin/count-received-requests',
  RECEIVE_SUPPORT_REQUEST_BY_ID: id => `/support-requests/admin/receive-request/${id}`,
  RESOLVE_SUPPORT_REQUEST_BY_ID: id => `/support-requests/admin/resolve-request/${id}`,

  // order
  GET_FAILED_TRANSACTION: '/order/admin/get-failed-transactions',
  CONFIRM_TRANSACTION: '/order/admin/confirm-transaction',
  COUNT_FAILED_TRANSACTION: '/order/admin/count-failed-transactions',
  GET_TRANSACTION_DETAIL_ID: id => `/order/admin/get-transaction-detail/${id}`
};

module.exports = ADMIN_SUPPORTER_API;
