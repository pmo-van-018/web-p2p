export const SHIFT_MANAGEMENT = {
  GET_SHIFT_STATUS: '/shifts/merchant/get-shift-status',
  GET_LIST_SHIFT: '/shifts/merchant/get-list-shift',
  MANAGER_GET_LIST_SHIFT: '/shifts/manager/get-list-shift',
  APPROVE_ALL_SHIFT: '/shifts/manager/approve-shifts',
  APPROVE_SHIFT: id => `/shifts/manager/approve-shift/${id}`,
  CHECK_IN: '/shifts/merchant/check-in',
  CHECK_OUT: '/shifts/merchant/check-out',
  MANAGER_EXPORT_REPORT: '/shifts/manager/export-report'
}
