<template>
  <div class="order-footer">
    <div class="footer-left-content">
      <div class="desc">
        {{ $t(actionDescription) }}
      </div>
      <Countdown v-if="timeout > 0" :key="orderDetail.orderId" :time-left="timeout" :class="{warning:isRedCountdown }" />
    </div>
    <button
      v-if="orderDetail.type===ORDER_TYPE.BUY"
      :disabled="disabledAction"
      class="primary"
      @click="$emit('confirm')"
    >
      {{ $t("merchant.transaction_detail.footer_btn_2") }}
    </button>
    <button
      v-else-if="isShowButton"
      :disabled="disabledAction"
      class="primary"
      @click="$emit('confirm')"
    >
      {{ $t('merchant.list_order.order_item.pay_for_seller') }}
    </button>
  </div>
</template>
<script>
import { STATUS_ORDER_BUY, ORDER_BUY_STEP, ORDER_SELL_STEP } from '@/resources/transfer-to-seller/index.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { mapState } from 'vuex';
import Countdown from '@/components/common/countdown.vue';

export default {
  components: {
    Countdown
  },
  props: {
    orderDetail: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      STATUS_ORDER_BUY,
      ORDER_BUY_STEP,
      ORDER_TYPE
    }
  },
  computed: {
    ...mapState('user', ['user']),
    timeout () {
      return this.$options.filters.convertToMilliseconds(this.orderDetail.timeout)
    },
    actionDescription () {
      return this.orderDetail.postType === ORDER_TYPE.SELL
        ? ORDER_BUY_STEP[this.orderDetail.step].descriptionDetailForMerchant
        : ORDER_SELL_STEP[this.orderDetail.step].descriptionDetailForMerchant
    },
    showSubDescription () {
      const steps = [
        ORDER_BUY_STEP.BUY_ENABLE_APPEAL_WHEN_CONFIRMED_FIAT_BY_MERCHANT.name,
        ORDER_BUY_STEP.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT.name
      ]
      return steps.includes(this.orderDetail.step)
    },
    isRedCountdown () {
      const steps = [
        ORDER_BUY_STEP.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT.name,
        ORDER_SELL_STEP.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT.name
      ]
      return steps.includes(this.orderDetail.step)
    },
    isShowButton () {
      const steps = [
        ORDER_SELL_STEP.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT.name
      ]
      return !steps.includes(this.orderDetail.step)
    },
    disabledAction () {
      const steps = [
        ORDER_BUY_STEP.BUY_ORDER_CREATED_BY_USER.name,
        ORDER_BUY_STEP.BUY_ORDER_CREATED_BY_USER_DEAL_TIME.name,
        ORDER_BUY_STEP.BUY_SENDING_CRYPTO_BY_MERCHANT.name,
        ORDER_SELL_STEP.SELL_ORDER_CREATED_BY_USER.name,
        ORDER_SELL_STEP.SELL_SENDING_CRYPTO_BY_USER.name,
        ORDER_SELL_STEP.SELL_SENDING_CRYPTO_FAILED.name
      ]
      return steps.includes(this.orderDetail.step)
    }
  },
  methods: {
  }
};
</script>
  <style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-footer.scss" />
