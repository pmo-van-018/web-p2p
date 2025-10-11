const MASTER_DATA_API = {
  GET_SETTINGS: '/master-data/admin/get-settings',
  UPDATE_SETTINGS: '/master-data/admin/update-settings',
  UPDATE_MAINTENANCE: '/master-data/admin/update-maintenance',
  SUPPORT_BANKS: '/master-data/list-supported-banks',
  GET_SETTING_LIMIT_BY_OPERATOR: '/master-data/merchant/get-setting-by-operator',
  GET_SETTING_LIMIT_BY_SUPPORTER: '/master-data/merchant/get-setting-by-supporter',
  GET_MAINTENANCE: '/master-data/maintenance',
  PRESIGNED_URL: '/master-data/admin/presigned-url',
  GET_NEWS: '/news/get-news'
}
module.exports = MASTER_DATA_API
