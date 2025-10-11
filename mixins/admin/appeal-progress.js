import { ORDER_STATUS, POST_TYPE } from '@/config/constant'
import BigNumber from 'bignumber.js'
import { BUY_APPEAL_RESULTS, SELL_APPEAL_RESULTS } from '@/constants/appeals'
import dayjs from 'dayjs'

export default {
  computed: {
    fiatSymbol () {
      return this.order.fiatSymbol
    },
    assetName () {
      return this.order.assetName
    },
    price () {
      return this.order.price
    },
    requestAmount () {
      return this.order.requestAmount || 0
    },
    amount () {
      return this.order.amount
    },
    status () {
      return this.order.status
    },
    isCompletedOrder () {
      return [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.status)
    },
    fromFiatAmount () {
      return this.$options.filters.formatMoney(this.order.requestTotalPrice)
    },
    toFiatAmount () {
      return this.$options.filters.formatMoney(this.order.totalPrice)
    },
    fromCryptoAmount () {
      return this.$options.filters.formatCrypto(this.requestAmount)
    },
    toCryptoAmount () {
      return this.$options.filters.formatCrypto(this.amount)
    },
    isEqualCryptoAmount () {
      return new BigNumber(this.requestAmount).isEqualTo(this.amount)
    },
    closeAt () {
      return this.appeal.closeAt
    },
    extraAt () {
      return this.appeal.addExtraAt
    },
    completedAt () {
      return this.appeal.completedAt
    },
    decisionAt () {
      return this.appeal.decisionAt
    },
    openAt () {
      return this.appeal.openAt
    },
    isForceCloseAppeal () {
      return this.decisionResult === BUY_APPEAL_RESULTS.BUY_EUWIN_FORCE_CLOSE
    },
    timeClose () {
      return dayjs(this.closeAt).format('HH:mm')
    },
    dateClose () {
      return dayjs(this.closeAt).format('DD/MM/YYYY')
    },
    timeExtra () {
      return dayjs(this.completedAt).format('HH:mm')
    },
    dateExtra () {
      return dayjs(this.completedAt).format('DD/MM/YYYY')
    },
    decisionResult () {
      return this.appeal?.decisionResult || ''
    },
    adminName () {
      return this.appeal?.admin?.nickName || ''
    },
    isHasResultAppeal () {
      return this.openAt != null &&
        (this.extraAt != null || this.extraAt == null) && this.decisionAt != null
    },
    isExtraTimeAppeal () {
      return this.openAt != null && this.extraAt != null
    },
    title () {
      if (this.isCompletedOrder) {
        return this.$t('admin.processing.title.result_appeal')
      }
      if (this.isHasResultAppeal) {
        return this.$t('admin.processing.title.result_appeal')
      }
      if (this.openAt != null && this.extraAt != null) {
        return this.$t('admin.processing.title.extract_time')
      }
      if (this.openAt != null) {
        return this.$t('admin.processing.title.user_complained_merchant')
      }
      return ''
    },
    winnerSubTitle () {
      if ([
        BUY_APPEAL_RESULTS.BUY_EUWIN_CANCEL_MC_VIOLATE,
        SELL_APPEAL_RESULTS.SELL_EUWIN_CANCEL_MC_VIOLATE
      ].includes(this.decisionResult)) {
        return this.$t('admin.processing.sub_title.user_won')
      }
      if ([
        BUY_APPEAL_RESULTS.BUY_MCWIN_CANCEL,
        SELL_APPEAL_RESULTS.SELL_MCWIN_SUCCESS
      ].includes(this.decisionResult)) {
        const resultOrder = this.order.postType === POST_TYPE.BUY ? this.$t('admin.processing.sub_title.order_success') : this.$t('admin.processing.sub_title.order_cancel')
        return `${this.$t('admin.action.merchant_won')} - ${resultOrder}. ${this.$t('admin.processing.sub_title.user_not_fault')}`
      }
      if ([
        BUY_APPEAL_RESULTS.BUY_NOWIN_CANCEL_EVIDENT_NOT_APPROVED,
        BUY_APPEAL_RESULTS.BUY_NOWIN_CANCEL_MC_HAS_RETURNED,
        SELL_APPEAL_RESULTS.SELL_NOWIN_CANCEL_MC_HAS_RETURNED
      ].includes(this.decisionResult)) {
        return this.$t('admin.processing.sub_title.cancel_appeal')
      }
      if ([
        BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN,
        BUY_APPEAL_RESULTS.BUY_EUWIN_FORCE_CLOSE
      ].includes(this.decisionResult)) {
        return this.$t('admin.processing.sub_title.user_won_opened_transaction')
      }
      return ''
    },
    subTitleCompletedAppeal () {
      if (this.status === ORDER_STATUS.COMPLETED) {
        return this.$t('admin.processing.sub_title.transaction_completed')
      }
      if (this.status === ORDER_STATUS.CANCELLED) {
        return this.$t('admin.processing.sub_title.transaction_cancelled', {
          name: this.adminName ? `(${this.adminName})` : ''
        })
      }
      return ''
    },
    subTitle () {
      if (this.subTitleCompletedAppeal) {
        return this.subTitleCompletedAppeal
      }
      if (this.isHasResultAppeal) {
        return this.subTitleFormatAppeal
      }
      if (this.subTitleExtraTime) {
        return this.subTitleExtraTime
      }
      if (this.subTitleOpenAt) {
        return this.subTitleOpenAt
      }
      return ''
    },
    subTitleExtraTime () {
      if (this.isExtraTimeAppeal) {
        return this.$t('admin.processing.sub_title.extract_time', {
          timeStart: this.timeClose,
          timeEnd: this.timeExtra,
          dateStart: this.dateClose,
          dateEnd: this.dateExtra
        })
      }
      return ''
    },
    subTitleContactAt () {
      return this.$t('admin.processing.sub_title.contact')
    },
    subTitleOpenAt () {
      if (this.appeal.openAt != null) {
        return this.order.type === POST_TYPE.SELL
          ? this.$t('admin.processing.sub_title.user_not_receiving_fiat')
          : this.$t('admin.processing.sub_title.user_not_receiving_crypto')
      }
      return ''
    },
    subTitleFormatAppeal () {
      if ([
        BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN,
        BUY_APPEAL_RESULTS.BUY_EUWIN_FORCE_CLOSE
      ].includes(this.decisionResult)) {
        if (this.isEqualCryptoAmount) {
          return ''
        }
        return this.$t(`admin.processing.sub_title.decision.${this.decisionResult}`, {
          fiatSymbol: this.fiatSymbol,
          assetName: this.assetName,
          fromFiat: this.fromFiatAmount,
          toFiat: this.toFiatAmount,
          fromCrypto: this.fromCryptoAmount,
          toCrypto: this.toCryptoAmount
        })
      }
      return this.$t(`admin.processing.sub_title.decision.${this.decisionResult}`)
    }
  }
}
