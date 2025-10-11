import BigNumber from 'bignumber.js'
import Vue from 'vue'
import RootImg from '@/components/common/root-img.vue'
import Loading from '@/components/common/loading.vue'
import { ToastPlugin } from 'bootstrap-vue'
import dayjs from 'dayjs'
import { FULL_DATE_FORMAT, DIFF_DATE_FORMAT } from '@/config/constant'
import { ObserveVisibility } from 'vue-observe-visibility'
import isNaN from 'lodash/isNaN'
import isNumber from 'lodash/isNumber'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime);
dayjs.extend(utc)

Vue.use(ToastPlugin)
Vue.component('root-img', RootImg);
Vue.component('loading', Loading);
Vue.filter('formatMarkToNumber', (value, multiplier = 1) => {
  if (value) {
    if (isNumber(value)) {
      return value
    }
    return Number(value.replace(/,/g, '')) * multiplier
  }
  return 0
})
Vue.filter('formatMarkBankNumber', (num) => {
  const patterns = {
    1: [/^(.{1})$/, '$1'],
    2: [/^(.{2})$/, '$1'],
    3: [/^(.{1}).+(.{1})$/, '$1*$2'],
    4: [/^(.{1}).+(.{1})$/, '$1**$2'],
    5: [/^(.{1}).+(.{1})$/, '$1***$2'],
    6: [/^(.{1}).+(.{2})$/, '$1***$2'],
    7: [/^(.{1}).+(.{3})$/, '$1***$2'],
    8: [/^(.{2}).+(.{3})$/, '$1***$2']
  };
  return num.replace(
    patterns[num.length]?.[0] ?? /^(.{3}).+(.{3})$/,
    patterns[num.length]?.[1] ?? `$1${'*'.repeat(num.length - 6)}$2`
  );
})
Vue.filter('formatMoney', (str, multiplier = 1) => {
  const amount = typeof str === 'number' ? str : Number(str.replace(/,/g, ''))
  const money = new BigNumber(amount).multipliedBy(multiplier).toNumber()
  return money.toLocaleString('en-US', { maximumFractionDigits: 0 })
})
Vue.filter('formatUpMoney', (str, multiplier = 1) => {
  const amount = typeof str === 'number' ? str : Number(str.replace(/,/g, ''))
  const money = new BigNumber(amount).multipliedBy(multiplier).toNumber()
  const formatMoney = new BigNumber(parseInt(money)).plus(money > parseInt(money) ? 1 : 0).toNumber()
  return formatMoney.toLocaleString('en-US', { maximumFractionDigits: 0 })
})
Vue.filter('formatDownMoney', (str, multiplier = 1) => {
  const amount = typeof str === 'number' ? str : Number(str.replace(/,/g, ''))
  const money = new BigNumber(amount).multipliedBy(multiplier).toString()
  const formatAmount = parseInt(money)
  return formatAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })
})
Vue.filter('formatHash', (str, length = 8) => {
  return str ? `${str.substr(0, length)}...${str.substr(str.length - length, length)}` : ''
})
Vue.filter('convertToMilliseconds', (seconds) => {
  return new BigNumber(seconds).multipliedBy(1000).toNumber();
})
Vue.filter('formatCrypto', (value, limitDecimal = 2, method = 'floor') => {
  let number = isNaN(value) ? 0 : typeof value === 'number' ? value : Number(value.replace(/,/g, ''))
  const checkDecimalLimitAmount = new BigNumber(10).pow(limitDecimal).toNumber()
  const checkNumber = Math[method](new BigNumber(number).multipliedBy(checkDecimalLimitAmount).toNumber())
  number = new BigNumber(checkNumber)
    .dividedBy(checkDecimalLimitAmount)
    .toFixed(limitDecimal)
  const chars = number.split('.');
  if (chars.length === 1) {
    return Number(chars[0]).toLocaleString('en-US');
  }
  return Number(chars[0]).toLocaleString('en-US') + '.' + chars[1]
})

Vue.filter('formatUpCrypto', (number, limitDecimal = 2) => {
  number = isNaN(number) ? 0 : typeof number === 'number' ? number : Number(number.replace(/,/g, ''))
  const checkDecimalLimitAmount = new BigNumber(10).pow(limitDecimal).toNumber()
  const checkNumber = new BigNumber(number).multipliedBy(checkDecimalLimitAmount).toNumber()
  number = new BigNumber(parseInt(checkNumber))
    .plus(checkNumber > parseInt(checkNumber) ? 1 : 0)
    .dividedBy(checkDecimalLimitAmount)
    .toFixed(limitDecimal)
  const chars = number.split('.');
  if (chars.length === 1) {
    return Number(chars[0]).toLocaleString('en-US');
  }
  return Number(chars[0]).toLocaleString('en-US') + '.' + chars[1]
})

Vue.filter('formatDownCrypto', (number, limitDecimal = 2) => {
  number = isNaN(number) ? 0 : typeof number === 'number' ? number : Number(number.replace(/,/g, ''))
  const checkDecimalLimitAmount = new BigNumber(10).pow(limitDecimal).toNumber()
  const checkNumber = new BigNumber(number).multipliedBy(checkDecimalLimitAmount).toNumber()
  number = new BigNumber(parseInt(checkNumber))
    .dividedBy(checkDecimalLimitAmount)
    .toFixed(limitDecimal)
  const chars = number.split('.');
  if (chars.length === 1) {
    return Number(chars[0]).toLocaleString('en-US');
  }
  return Number(chars[0]).toLocaleString('en-US') + '.' + chars[1]
})

Vue.filter('formatDateTime', (
  dateTime,
  formatDateTime = FULL_DATE_FORMAT) => {
  return dateTime ? dayjs(dateTime).format(formatDateTime) : ''
})

Vue.filter('formatSecondsToDate', (totalSeconds, formatDateTime = FULL_DATE_FORMAT) => {
// Convert the total seconds into days, hours, minutes, and seconds
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);
  const resultParts = [];

  if (days > 0) {
    resultParts.push(`${days} ngày`);
  }
  if (hours > 0 || days > 0) {
    resultParts.push(`${hours} giờ`);
  }
  if (minutes > 0) {
    resultParts.push(`${minutes} phút`);
  }
  if (seconds > 0) {
    resultParts.push(`${Math.round(seconds)} giây`);
  }

  return resultParts.length ? resultParts.join(' ') : '--';
})

Vue.filter('diffForHumans', (dateTime) => {
  dayjs.locale('vi')
  const dateTimeFormat = dayjs(dateTime).format(DIFF_DATE_FORMAT)
  return dateTimeFormat ? dayjs().to(dayjs(dateTimeFormat)) : ''
})

Vue.directive('observe-visibility', ObserveVisibility)

Vue.directive('click-outside', {
  bind (element, binding, vnode) {
    element.clickOutsideEvent = function (event) {
      if (!(element === event.target || element.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', element.clickOutsideEvent)
  },
  unbind (element) {
    document.body.removeEventListener('click', element.clickOutsideEvent)
  }
});

Vue.prototype.$transactionAlert = function ({ type = 'success', orderType = 'buy', title = '', message = '', autoHideDelay = 5000 }) {
  /**
   * note:
   *  ${type} includes ['success', 'processing', 'fail', 'buy-order', 'sell-order' ]
   *  ${orderType} includes ['buy', 'sell']
   */
  const vNodesTitle = this.$createElement(
    'div',
    { class: ['d-flex'] },
    [
      this.$createElement('div', { class: orderType }, this.$t('home.' + orderType)),
      this.$createElement('div', { class: 'title' }, title)
    ]
  )
  this.$bvToast.toast(message, {
    title: vNodesTitle,
    autoHideDelay,
    toaster: 'b-toaster-bottom-left',
    toastClass: ['transaction-alert', type]
  })
}
Vue.filter('formatInputToNumber', (value, multiplier = 1) => {
  if (value) {
    if (isNumber(value)) {
      return value
    }
    return Number(value.replace(/,/g, '')) * multiplier
  }
  return null;
})
