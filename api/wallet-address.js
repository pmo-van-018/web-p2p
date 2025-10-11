const WALLET_ADDRESS_API = {
  ACTIVE_WALLET_ADDRESS_BY_ID: id => `/profile/merchant/active-wallet-address/${id}`,
  DELETE_WALLET_ADDRESS_BY_ID: id => `/profile/merchant/delete-wallet-address/${id}`,
  ADD_WALLET_ADDRESS: '/profile/merchant/add-wallet-address',
  ADMIN_ACTIVE_WALLET_ADDRESS_BY_ID: id => `/profile/admin/active-wallet-address/${id}`,
  ADMIN_DELETE_WALLET_ADDRESS_BY_ID: id => `/profile/admin/delete-wallet-address/${id}`,
  ADMIN_ADD_WALLET_ADDRESS: '/profile/admin/add-wallet-address',
  LIST_WALLET_ADDRESSES: '/profile/merchant/list-wallet-address'
};

module.exports = WALLET_ADDRESS_API;
