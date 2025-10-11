<template>
  <card-order
    v-bind="$attrs"
    :order="order"
    :is-hidden-bank-number="isHiddenBankNumber"
    :is-view-detail="!isCancelled"
    :finish-status-text="processDescriptionHistory"
    v-on="$listeners"
  >
    <template #actions>
      <div class="card-order-user">
        <div class="card-order-user__progress">
          <order-appeal-status
            v-if="isCancelled"
            :type="USER_TYPE.USER"
            :is-visible-title="false"
            :order="order"
            :appeal="order.appeal"
          />
          <order-progressing-countdown
            v-else
            :is-visible-time-out="isVisibleTimeOut"
            :time-out="timeoutMilliSeconds"
            :text="processDescriptionCountdown"
            :pause-countdown="pauseCountdown"
            :is-warning="isWarningTimeOut"
            is-vertical
          />
        </div>
      </div>
    </template>
  </card-order>
</template>
<script>
import { USER_TYPE } from '@/config/constant';
import countdownActionMixin from '~/mixins/user/orders/countdown-action'

export default {
  components: {
    CardOrder: () => import('~/components/mobile/orders/card/index.vue'),
    OrderProgressingCountdown: () => import('~/components/desktop/orders/progressing-countdown/index.vue'),
    OrderAppealStatus: () => import('~/components/desktop/orders/table/items/order-appeal-status.vue')
  },
  mixins: [countdownActionMixin],
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
    }
  },
  data () {
    return {
      USER_TYPE
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/orders-management/card-order/index.scss">
</style>
