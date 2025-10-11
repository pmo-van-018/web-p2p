<template>
  <div v-if="hasComplaintFromEndUser" class="order-footer">
    <div class="order-footer__container">
      <div class="order-footer__inner">
        <div class="order-footer__text" v-html="descriptionDetailMerchant" />
      </div>
    </div>
  </div>
</template>
<script>
import orderActionTransferMixin from '~/mixins/merchant/orders/action-transfer'
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '~/constants/orders'

export default {
  mixins: [orderActionTransferMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    hasComplaintFromEndUser () {
      return [
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT,
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED,
        SELL_ORDER_STEPS.SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER
      ].includes(this.order.step)
    },
    descriptionDetailMerchant () {
      return `${this.$t(`merchant.list_order.descriptionDetailMerchant.${this.order.step}`, {
          assetName: this.assetName
        })} <span>${this.closeDateTime}</span>`
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/detail-row-order/order-footer-manager.scss">
</style>
