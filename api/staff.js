const STAFF_API = {
  STAFF: '/profile/merchant/create-staff',
  LIST_STAFFS: '/profile/merchant/list-staff',
  LIST_STAFFS_BY_MANAGER: id => `/profile/admin/list-manager-staff/${id}`,
  STAFF_BY_ID: id => `/profile/merchant/show-staff-info/${id}`,
  UPDATE_STAFF: id => `/profile/merchant/update-staff/${id}`,
  ACTIVE_STAFF_BY_ID: id => `/profile/merchant/active-staff/${id}`,
  INACTIVE_STAFF_BY_ID: id => `/profile/merchant/inactive-staff/${id}`,
  DELETE_STAFF_BY_ID: id => `/profile/merchant/delete-staff/${id}`,
  GET_SUPPORTER_PROCESSING: '/profile/merchant/list-supporter-processing'
};

module.exports = STAFF_API;
