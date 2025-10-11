export const SYSTEM_ADMIN_API = {
  LIST: '/profile/system-admin/list-super-admin',
  CREATE: '/profile/system-admin/create-super-admin',
  ACTIVE_SUPPER_ADMIN_BY_ID: id => `/profile/system-admin/active-super-admin/${id}`,
  INACTIVE_SUPPER_ADMIN_BY_ID: id => `/profile/system-admin/inactive-super-admin/${id}`,
  DELETE_SUPPER_ADMIN_BY_ID: id => `/profile/system-admin/delete-super-admin/${id}`
}
