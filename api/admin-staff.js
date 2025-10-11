export const ADMIN_STAFF = {
  INDEX: '/operation/admin/list-staff',
  DELETE: '/operation/admin/delete-manager',
  UPDATE_STAFF_BY_ID: id => `/operation/admin/update-staff/${id}`,
  ACTIVE_STAFF: id => `/operation/admin/active-staff/${id}`,
  INACTIVE_STAFF: id => `/operation/admin/inactive-staff/${id}`
}
