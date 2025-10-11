import { ORDER_TYPE } from '@/resources/order-type.js';
import { FULL_DATE_FORMAT } from '@/config/constant'
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS, ORDER_CANCEL_REASON } from '@/constants/orders'
import { BUY_APPEAL_RESULTS, SELL_APPEAL_RESULTS } from '@/constants/appeals'
import dayjs from 'dayjs'

export default {
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    isBuyOrder () {
      return this.order?.type === ORDER_TYPE.BUY
    },
    assetName () {
      return this.order?.assetName || ''
    },
    assetNetwork () {
      return this.order?.assetNetwork || ''
    },
    desc () {
      return this.isBuyOrder
        ? this.$t('transfer_seller.completed.label.buy_success')
        : this.$t('end_user_sell.label.sell_completed', {
          assetName: this.assetName
        })
    },
    amount () {
      return `${this.$options.filters.formatCrypto(this.order?.amount || 0)} ${this.order?.assetName || ''}`
    },
    lastTransaction () {
      return this.order?.transactions?.length
        ? this.order?.transactions[this.order?.transactions?.length - 1]
        : {}
    },
    createdTime () {
      if (!this.order || !this.order.createdTime) {
        return ''
      }
      return dayjs(this.order.createdTime).format(FULL_DATE_FORMAT)
    },
    orderId () {
      return this.order?.id
    },
    orderType () {
      return this.order?.type || ''
    },
    orderTypeText () {
      if ([ORDER_TYPE.BUY, ORDER_TYPE.SELL].includes(this.orderType)) {
        return `${this.$t('action.continue_trading')}`
      }
      return ''
    },
    linkRedirectHome () {
      if ([ORDER_TYPE.BUY, ORDER_TYPE.SELL].includes(this.orderType) && this.assetName && this.assetNetwork) {
        const asset = `${this.assetName}-${this.assetNetwork}`
        return `/marketplace/${this.orderType}?asset=${asset}`.toLowerCase()
      }
      return '/'
    },
    completedAndCanceledText () {
      if (this.order?.cancelReason && this.order?.cancelReason === ORDER_CANCEL_REASON) {
        return 'Giao dịch bị hủy bởi hệ thống vì người bán nhập sai txID quá nhiều lần.'
      }
      if (this.order?.step && !this.order?.appeal) {
        return {
          [BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_SUCCESS]: 'Tiền mã hóa đã được chuyển vào địa chỉ ví của người mua. Giao dịch hoàn thành.',
          [BUY_ORDER_STEPS.BUY_ORDER_CANCELLED_BY_USER]: 'Giao dịch đã bị hủy. Vui lòng liên hệ bộ phận CSKH nếu có thắc mắc.',
          [BUY_ORDER_STEPS.BUY_ORDER_CANCELLED_BY_SYSTEM]: 'Giao dịch bị hủy bởi hệ thống.',
          [SELL_ORDER_STEPS.SELL_CONFIRMED_FIAT_BY_USER]: 'Người bán đã nhận được thanh toán từ người mua. Giao dịch hoàn thành.',
          [SELL_ORDER_STEPS.SELL_ORDER_CANCELLED_BY_USER]: 'Giao dịch đã bị hủy. Vui lòng liên hệ hỗ trợ khách hàng nếu có thắc mắc.',
          [SELL_ORDER_STEPS.SELL_ORDER_CANCELLED_BY_SYSTEM]: 'Giao dịch bị hủy bởi hệ thống.'
        }[this.order?.step] || ''
      }
      return ''
    },
    completedAndCanceledWithAppealText () {
      if (this.order?.step && this.order?.appeal) {
        return {
          [BUY_APPEAL_RESULTS.BUY_NOWIN_CANCEL_EVIDENT_NOT_APPROVED]: 'Giao dịch đã bị hủy vì các bên liên quan không cung cấp đủ bằng chứng để xử lý. Vui lòng liên hệ bộ phận CSKH nếu có thắc mắc.',
          [BUY_APPEAL_RESULTS.BUY_MCWIN_CANCEL]: 'Giao dịch đã bị hủy, người bán đã thắng kiện. Vui lòng liên hệ bộ phận CSKH nếu có thắc mắc.',
          [BUY_APPEAL_RESULTS.BUY_EUWIN_CANCEL_MC_VIOLATE]: 'Giao dịch đã bị hủy, người mua đã thắng kiện. Bộ phận CSKH sẽ hoàn tiền pháp định cho người mua và tiến hành xử phạt người bán.',
          [BUY_APPEAL_RESULTS.BUY_EUWIN_FORCE_CLOSE]: 'Giao dịch đã bị hủy vì người bán không chuyển tiền mã hóa cho người mua. Bộ phận CSKH sẽ hoàn tiền pháp định cho người mua và tiến hành xử phạt người bán.',
          [BUY_APPEAL_RESULTS.BUY_NOWIN_CANCEL_MC_HAS_RETURNED]: 'Giao dịch đã bị hủy, người bán đã hoàn tiền pháp định cho người mua. Vui lòng liên hệ bộ phận CSKH nếu có thắc mắc.',
          [SELL_APPEAL_RESULTS.SELL_NOWIN_CANCEL_MC_HAS_RETURNED]: 'Giao dịch đã bị hủy, người mua đã chuyển hoàn tiền mã hóa cho người bán. Vui lòng liên hệ hỗ trợ khách hàng nếu có thắc mắc.',
          [SELL_APPEAL_RESULTS.SELL_MCWIN_SUCCESS]: 'Giao dịch hoàn thành, người mua đã thắng kiện. Vui lòng liên hệ bộ phận CSKH nếu có thắc mắc.',
          [SELL_APPEAL_RESULTS.SELL_EUWIN_CANCEL_MC_VIOLATE]: 'Giao dịch đã bị hủy, người bán đã thắng kiện. Bộ phận CSKH sẽ hoàn tiền pháp định cho người bán và tiến hành xử phạt người mua.'
        }[this.order?.appeal?.decisionResult]
      }
      return ''
    },
    contentMessageSystem () {
      return this.completedAndCanceledText || this.completedAndCanceledWithAppealText
    },
    orderTypeClass () {
      return this.order?.type === ORDER_TYPE.BUY ? 'buy' : 'sell'
    },
    orderText () {
      return this.order?.type === ORDER_TYPE.BUY ? this.$t('common.buy') : this.$t('common.sell')
    }
  },
  mounted () {
    this.$bvModal.hide('modalPaymentCancellation')
  }
};
