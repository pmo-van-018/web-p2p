const MD5 = require('md5.js')

export const REGISTER_STEPS = {
  INSTALL: 1,
  REGISTER: 2,
  INPUT_OTP: 3
}
export const TWO_FACTOR_AUTH_STATUS = {
  ENABLED: 1,
  DISABLED: 2
}

export const SESSION_KEY = ($config) => {
  return {
    [process?.env?.USER_DOMAIN || $config?.USER_DOMAIN]: `_p2pd_${new MD5().update('sess').digest('hex').slice(0, 8)}`,
    [process?.env?.OPERATION_DOMAIN || $config?.OPERATION_DOMAIN]: `_p2pd_${new MD5().update('sess_operation').digest('hex').slice(0, 8)}`,
    [process?.env?.ADMIN_DOMAIN || $config?.ADMIN_DOMAIN]: `_p2pd_${new MD5().update('sess_admin').digest('hex').slice(0, 8)}`,
    [process?.env?.REPORTER_DOMAIN || $config?.REPORTER_DOMAIN]: `_p2pd_${new MD5().update('sess_reporter').digest('hex').slice(0, 8)}`
  }
}
