export const getForwardedHeader = () => {
  return {
    'x-forwarded-host': window.location.host,
    'X-forwarded-proto': window.location.protocol.slice(0, -1)
  }
}
