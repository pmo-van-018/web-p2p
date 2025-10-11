<template>
  <div class="order-footer">
    <div class="order-footer__container">
      <div class="order-footer__inner">
        <order-progressing-countdown
          :is-visible-time-out="isVisibleTimeOut"
          :pause-countdown="isPauseCountdown"
          :time-out="timeoutMilliseconds"
          :text="descriptionDetailMerchant"
          :is-warning="isWarningTimeOut"
        />
        <div v-if="enableSubmitTx" class="tx-confirm">
          {{ $t('tx_confirm.text_pc_operation') }} <span @click="$emit('on-tx-confirm')">{{ $t('action.reconfirm') }}</span>
        </div>
      </div>
      <div v-if="isPendingOrder" class="order-footer__inner">
        <div class="order-footer__action">
          <order-actions
            :order="order"
            :is-loading="isLoading"
            :visible-action-appeal="false"
            :disabled="disabledButton"
            :visible-appeal="isVisibleAppealButton"
            :visible-chat="isVisibleChatButton"
            :hidden-transfer="isHiddenActionTransfer"
            @click="onTransferAction"
            @on-open-appeal="$emit('on-open-appeal', order)"
            @on-term-transfer="$emit('on-term-transfer', $event)"
            @on-confirmed-processed="$emit('on-confirmed-processed', order)"
          >
            {{ actionTransferDetailText }}
          </order-actions>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import orderActionTransferMixin from '~/mixins/merchant/orders/action-transfer'

export default {
  components: {
    OrderProgressingCountdown: () => import('~/components/desktop/orders/progressing-countdown/index.vue'),
    OrderActions: () => import('~/components/desktop/orders/table/items/order-actions.vue')
  },
  mixins: [orderActionTransferMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    timeout () {
      return this.$options.filters.convertToMilliseconds(this.order.timeout)
    },
    step () {
      return this.order.step
    },
    isTimeout () {
      return !this.order?.timeout || this.order?.timeout <= 0
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/detail-row-order/order-footer.scss">
</style>
