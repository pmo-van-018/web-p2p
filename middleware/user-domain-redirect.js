export default function ({ req, store, redirect, route, app }) {
  const userDomainRedirect = app.$config.STATIC_DOMAIN || ''
  const host = process.server ? req.headers.host : window.location.host
  if (host !== app.$config.USER_DOMAIN) {
    return redirect(userDomainRedirect + route.fullPath);
  }
}
