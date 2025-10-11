const MERCHANT_MANAGER_API = {
  ADMIN_MERCHANT_MANAGER: '/profile/admin/list-manager',
  ADMIN_USERS: '/profile/admin/list-users',
  CREATE_MERCHANT_MANAGER: '/profile/admin/create-manager',
  MERCHANT_MANAGER_BY_ID: id => `/profile/admin/get-manager-info/${id}`,
  ACTIVE_MERCHANT_MANAGER_BY_ID: id => `/profile/admin/active-manager/${id}`,
  INACTIVE_MERCHANT_MANAGER_BY_ID: id => `/profile/admin/inactive-manager/${id}`,
  DELETE_MERCHANT_MANAGER_BY_ID: id => `/profile/admin/delete-manager/${id}`,
  SET_GASLESS_BY_ID: id => `/profile/admin/set-gasless-manager/${id}`,
  ADMIN_USER_WALLET_ADDRESS: '/profile/admin/search-user-by-address',
  GET_LIST_AVATAR: '/profile/merchant/list-used-avatars',
  UPDATE_AVATAR: '/profile/merchant/update-avatar',
  MERCHANT_MANAGER_LIST_BALANCE_CONFIGURATIONS: '/profile/merchant/get-balance-configuration',
  MERCHANT_MANAGER_UPDATE_BALANCE_CONFIGURATIONS: '/profile/merchant/set-balance-configuration',
  ADJUST_RATE: id => `/public-view-adjustment/${id}`
};

module.exports = MERCHANT_MANAGER_API;
