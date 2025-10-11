const API_2FA = {
  MERCHANT_GENERATE_SECRET: '/auth/merchant/generate-2fa-secret',
  MERCHANT_REGISTER_2FA: '/auth/merchant/register-2fa',
  MERCHANT_UNREGISTER_2FA: '/auth/merchant/unregister-2fa',
  MERCHANT_LOGIN_2FA: '/auth/merchant/login-2fa',
  ADMIN_GENERATE_SECRET: '/auth/admin/generate-2fa-secret',
  ADMIN_REGISTER_2FA: '/auth/admin/register-2fa',
  ADMIN_UNREGISTER_2FA: '/auth/admin/unregister-2fa',
  ADMIN_LOGIN_2FA: '/auth/admin/login-2fa'
}
module.exports = API_2FA
