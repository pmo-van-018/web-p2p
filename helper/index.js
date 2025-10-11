import unionBy from 'lodash/unionBy'
import { FULL_DATE_FORMAT, USER_TYPE } from '@/config/constant'
import uniqolor from 'uniqolor';
import dayjs from 'dayjs'
import BigNumber from 'bignumber.js';

export const formatTime = time => dayjs(time).format(FULL_DATE_FORMAT)
export const formatNumber = (value, suffix) => `${Intl.NumberFormat('en-US').format(value)} ${suffix}`
export const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
export const convertToStringQuery = x => '?' + Object.keys(x).map((key) => {
  return Array.isArray(x[key]) ? `${key}=${x[key].toString()}` : `${key}=${encodeURIComponent(x[key])}`;
}).join('&');
export const getRandomColor = () => {
  const colors = [
    'green-200',
    'green-500',
    'orange-200',
    'orange-500',
    'yellow-600',
    'yellow-900'
  ];
  const chosenNumber = Math.floor(Math.random() * colors.length);
  return colors[chosenNumber];
}

export const mergeByProp = (firstArray, lastArray, prop) => {
  return unionBy(firstArray, lastArray, prop)
}

export const mergeUniqueByProp = (destArr, targetArr, prop) => {
  const arr = [...destArr];
  targetArr.forEach((e) => {
    const index = destArr.findIndex(a => a[prop] === e[prop])
    if (index > -1) {
      arr[index] = e;
    } else {
      arr.push(e)
    }
  })
  return arr;
}

export const getTotalPage = (total, perPage) => {
  if (total === 0 || perPage === 0) { return 0 }
  return Math.ceil(total / perPage)
}

export const openLink = (url) => {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_self';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export const hiddenAsteriskString = (text, atPosition = 4) => {
  const asterisk = '**********';
  if (text.length < atPosition) {
    return asterisk + text;
  }
  return asterisk + text.substring(text.length - atPosition);
}

export const trimMultipleSpaceStartEndString = (text) => {
  if (!text) { return text; }
  return text.replace(/^\s+|\s+$/g, '');
}

export const getUniqColor = (value = 0) => {
  const { color } = uniqolor(value, { format: 'rgb' })
  return color
}

export const toNonAccentVietnamese = (str) => {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export const isPermissionRequest = (token, value) => {
  return Buffer.from(token, 'base64').toString('utf-8') === value || false;
}

export const getRoleTypeByPrefix = (prefix) => {
  if (window.location.host.includes(prefix)) {
    return USER_TYPE.ADMIN;
  } else if (window.location.host.includes(prefix)) {
    return USER_TYPE.MERCHANT;
  } else {
    return USER_TYPE.USER
  }
}

export const POPUP_SHOW_OPTIONS_KEY = 'hidePopups'

export const isKeepPopupOptionsLocalStorage = (modalId, orderType) => {
  const hidePopupOptions = JSON.parse(
    localStorage.getItem(POPUP_SHOW_OPTIONS_KEY)
  )
  if (!hidePopupOptions || !hidePopupOptions?.length) {
    return true
  }
  const modalKeyId = `${modalId}-${orderType}`
  return !hidePopupOptions?.includes(modalKeyId)
}

export const setPopupOptionsLocalStorage = (modalId, orderType, isShow) => {
  if (!isShow) { return }
  const modalKeyId = `${modalId}-${orderType}`
  const hidePopupOptions = JSON.parse(
    localStorage.getItem(POPUP_SHOW_OPTIONS_KEY)
  )
  if (!hidePopupOptions || !hidePopupOptions.length) {
    const hideOptions = JSON.stringify([modalKeyId])
    localStorage.setItem(POPUP_SHOW_OPTIONS_KEY, hideOptions)
    return;
  }
  if (!hidePopupOptions?.includes(modalKeyId)) {
    hidePopupOptions.push(modalKeyId)
    localStorage.setItem(POPUP_SHOW_OPTIONS_KEY, JSON.stringify(hidePopupOptions))
  }
}

export const removeItemInPopupOptionsLocalStorage = (modalId, orderType) => {
  const hidePopupOptions = JSON.parse(
    localStorage.getItem(POPUP_SHOW_OPTIONS_KEY)
  )
  if (hidePopupOptions) {
    const hidePopupFiltered = hidePopupOptions.filter(item => item !== `${modalId}-${orderType}`)
    localStorage.setItem(POPUP_SHOW_OPTIONS_KEY, JSON.stringify(hidePopupFiltered))
  }
}

export const formatPercentage = (value, sum, decimalPlaces = 2) => {
  // Calculate the percentage
  const percentage = new BigNumber(value)
    .dividedBy(sum)
    .multipliedBy(100)
    .toFixed(decimalPlaces);

  if (percentage.endsWith('.00')) {
    return percentage.slice(0, -3);
  } else {
    return percentage;
  }
}
