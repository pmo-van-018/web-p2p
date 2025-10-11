import { SESSION_KEY } from '../constants/2fa';

export const getSessionKey = (host, $config) => {
  let sessionKey = '';
  switch (host) {
    case process.env.USER_DOMAIN:
    case process.env.OPERATION_DOMAIN:
    case process.env.ADMIN_DOMAIN:
    case process.env.REPORTER_DOMAIN:
    case $config?.USER_DOMAIN:
    case $config?.OPERATION_DOMAIN:
    case $config?.ADMIN_DOMAIN:
    case $config?.REPORTER_DOMAIN:
      sessionKey = SESSION_KEY($config)[host];
      break;
    default:
      sessionKey = '_p2pd_sess'
  }

  return sessionKey
}
