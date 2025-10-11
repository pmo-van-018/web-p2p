export function getConfig ($config) {
  if (window.location.host.includes($config.ADMIN_PREFIX)) {
    return {
      projectId: $config.WALLET_CONNECT_PRJ_ADMIN_ID,
      dappUrl: $config.WALLET_CONNECT_ADMIN_DOMAIN
    }
  } else if (window.location.host.includes($config.OPERATION_PREFIX)) {
    return {
      projectId: $config.WALLET_CONNECT_PRJ_OPERATION_ID,
      dappUrl: $config.WALLET_CONNECT_OPERATION_DOMAIN
    }
  } else {
    return {
      projectId: $config.WALLET_CONNECT_PRJ_ID,
      dappUrl: $config.WALLET_CONNECT_USER_DOMAIN
    }
  }
}
