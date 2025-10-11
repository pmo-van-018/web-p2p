<template>
  <card-order
    v-bind="$attrs"
    :finish-status-text="finishStatusText"
    :order="order"
    :is-hidden-bank-number="isHiddenBankNumber"
    :is-visible-qr-bank-code="isVisibleQrBankCode"
    :is-view-detail="!isCancelled"
    :is-visible-supporter-process="isVisibleSupporterProcess"
    v-on="$listeners"
  >
    <template v-if="isCancelled" #actions>
      <order-appeal-status
        :type="USER_TYPE.MERCHANT"
        :is-visible-title="false"
        :order="order"
        :appeal="order.appeal"
      />
    </template>
    <template v-else-if="isPendingOrder" #actions>
      <div class="card-order">
        <div class="card-order__progress">
          <order-progressing-countdown
            :is-visible-time-out="isVisibleTimeOut"
            :time-out="timeoutMilliseconds"
            :text="descriptionMerchant"
            :is-warning="isWarningTimeOut"
            is-vertical
            @time-out="$emit('time-out', order)"
          />
        </div>
        <div class="card-order__action">
          <order-actions
            :order="order"
            :is-loading="isLoading"
            :disabled="disabledButton"
            :visible-appeal="isVisibleAppealButton"
            :visible-chat="isVisibleChatButton"
            :hidden-transfer="isHiddenActionTransfer"
            :joined-room="joinedRoom"
            @click="onTransferAction"
            @on-open-appeal="$emit('on-open-appeal', order)"
            @on-open-chat="$emit('on-open-chat', order)"
            @on-confirmed-processed="$emit('on-confirmed-processed', order)"
          >
            {{ actionTransferText }}
          </order-actions>
          <base-button
            v-if="enablePickOrder"
            variants="contained"
            color="primary"
            @click.stop="$emit('supporter-pick-order', order.orderId)"
          >
            {{ $t('merchant.supporter.pick_btn') }}
          </base-button>
        </div>
      </div>
    </template>
  </card-order>
</template>
<script>
import { ORDER_STATUS, USER_TYPE } from '@/config/constant'
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders'
import orderActionTransferMixin from '~/mixins/merchant/orders/action-transfer'

export default {
  components: {
    CardOrder: () => import('~/components/mobile/orders/card/index.vue'),
    OrderProgressingCountdown: () => import('~/components/desktop/orders/progressing-countdown/index.vue'),
    OrderActions: () => import('~/components/desktop/orders/table/items/order-actions.vue'),
    OrderAppealStatus: () => import('~/components/desktop/orders/table/items/order-appeal-status.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [orderActionTransferMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    isCancelled: {
      type: Boolean,
      default: false
    },
    isHiddenBankNumber: {
      type: Boolean,
      default: false
    },
    isVisibleQrBankCode: {
      type: Boolean,
      default: true
    },
    isVisibleSupporterProcess: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    joinedRoom: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      USER_TYPE
    }
  },
  computed: {
    finishStatusText () {
      if (this.order?.status === ORDER_STATUS.CANCELLED) {
        if (this.step === SELL_ORDER_STEPS.SELL_ORDER_CANCELLED_BY_USER) {
          return this.$t('merchant.order-step.buyer-cancel')
        } else if (this.step === BUY_ORDER_STEPS.BUY_ORDER_CANCELLED_BY_USER) {
          return this.$t('merchant.order-step.seller-cancel')
        } else {
          return this.$t('merchant.order-step.cancel-by-system')
        }
      } else {
        return ''
      }
    },
    enablePickOrder () {
      return this.order?.supporterView && this.order?.readOnly
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/orders-management/card-order/index.scss">
</style>
