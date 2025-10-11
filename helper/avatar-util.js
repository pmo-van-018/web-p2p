import {
  MERCHANT_AVATAR_NUMBER,
  MERCHANT_AVATAR_PATH,
  USER_AVATAR_PATH,
  USER_AVATAR_MAX_NUMBER
} from '@/constants/image-paths';

export const getMerchantAvatar = (name) => {
  return _getAvatar(name, MERCHANT_AVATAR_NUMBER, MERCHANT_AVATAR_PATH)
}

const _getAvatar = (name, MAX_AVATAR, PATH_RESOLVER) => {
  if (!name) {
    return null
  }
  const [prefix, index] = name.split('_');
  if (prefix !== 'avatar' || isNaN(+index) || +index < 0 || +index > MAX_AVATAR) {
    return null
  }
  return PATH_RESOLVER(name)
}

export const getAvatar = (name, role) => {
  if (role?.startsWith('MERCHANT')) {
    return _getAvatar(name, MERCHANT_AVATAR_NUMBER, MERCHANT_AVATAR_PATH)
  }
  if (role?.startsWith('USER')) {
    return _getAvatar(name, USER_AVATAR_MAX_NUMBER, USER_AVATAR_PATH)
  }
  return null
}
