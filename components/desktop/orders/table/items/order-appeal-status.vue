<template>
  <div class="processing">
    <div class="processing__content">
      <div v-if="isVisibleTitle" class="processing__title">{{ titleModified ? titleModified : title }}</div>
      <div v-if="isVisibleContent"  class="processing__sub-title">
        <p v-if="content">{{ content }}</p>
        <p v-html="subContent" />
        <p v-if="isForceCloseAppeal">{{ forceCloseAppealText }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import appealProgressMixin from '@/mixins/admin/appeal-progress'
import { BUY_APPEAL_RESULTS, SELL_APPEAL_RESULTS } from '@/constants/appeals'
import { USER_TYPE } from '@/config/constant';
import { ORDER_APPEAL_KEY_LANG } from '@/constants/orders';

export default {
  mixins: [appealProgressMixin],
  props: {
    titleModified: {
      type: String,
      default: ''
    },
    isVisibleTitle: {
      type: Boolean,
      default: true
    },
    order: {
      type: Object,
      default: () => ({})
    },
    appeal: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: USER_TYPE.MERCHANT,
      validator (value) {
        return [USER_TYPE.MERCHANT, USER_TYPE.USER].includes(value)
      }
    },
    isVisibleContent: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    typeKeyLang () {
      return this.type === USER_TYPE.USER ? ORDER_APPEAL_KEY_LANG.USER : ORDER_APPEAL_KEY_LANG.MERCHANT
    },
    forceCloseAppealText () {
      return this.type === USER_TYPE.USER ? this.$t('user_orders.decision.force_close_appeal')
        : this.$t('merchant.decision.force_close_appeal')
    },
    content () {
      switch (this.decisionResult) {
        case BUY_APPEAL_RESULTS.BUY_EUWIN_FORCE_CLOSE: {
          return this.type === USER_TYPE.USER ? `${this.$t('user_orders.decision.user_win')}`
            : `${this.$t('merchant.decision.open_order')} - ${this.$t('merchant.decision.user_win')}`
        }
        case BUY_APPEAL_RESULTS.BUY_MCWIN_CANCEL: {
          return this.$t(`${this.typeKeyLang}.decision.merchant_win`)
        }
        case BUY_APPEAL_RESULTS.BUY_EUWIN_CANCEL_MC_VIOLATE:
        case SELL_APPEAL_RESULTS.SELL_EUWIN_CANCEL_MC_VIOLATE: {
          return this.$t(`${this.typeKeyLang}.decision.user_win`)
        }
        default: {
          return this.$t(`${this.typeKeyLang}.decision.cancelled`)
        }
      }
    },
    subContent () {
      if (BUY_APPEAL_RESULTS.BUY_EUWIN_FORCE_CLOSE === this.decisionResult) {
        if (this.isEqualCryptoAmount) {
          return ''
        }
        return this.$t(`${this.typeKeyLang}.decision.${this.decisionResult}`, {
          fiatSymbol: this.fiatSymbol,
          assetName: this.assetName,
          fromFiat: this.fromFiatAmount,
          toFiat: this.toFiatAmount,
          fromCrypto: this.fromCryptoAmount,
          toCrypto: this.toCryptoAmount
        })
      }
      return this.decisionResult && this.decisionResult !== BUY_APPEAL_RESULTS.BUY_MCWIN_CANCEL
        ? this.$t(`${this.typeKeyLang}.decision.${this.decisionResult}`)
        : ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/appeals/processing/index.scss">
</style>
