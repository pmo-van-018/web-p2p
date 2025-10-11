<template>
  <div class="order-item" :class="className">
    <div class="order-item__field order-item__id">
      <span class="order-item__id-label">{{ typeOrder }}</span>
      <div>
        <span class="order-item__id-value">
          {{ '#' + order.orderRefId }}
        </span><br>
        <span v-if="isPendingOrder" class="order-item__id-status">{{ statusPending }}</span>
      </div>
    </div>
    <div class="order-item__field price-col">
      <div class="order-item__price">
        <span class="order-item__price--bold">{{ order.fiatSymbol }}</span>{{ order.totalPrice | formatMoney }}
        <CopyButton v-if="order.totalPrice" :value="order.totalPrice" />
      </div>
      <span class="order-item__amount">{{ order.amount | formatCrypto }} {{ order.asset }}</span>
    </div>
    <div class="order-item__field order-item__transcode">
      {{ order.transCode || '-' }}
      <CopyButton v-if="order.transCode" :value="order.transCode" />
    </div>
    <div v-if="!isPendingOrder" class="order-item__field order-item__time">{{ endTime }}</div>
    <div class="order-item__field" :class="{'order-item__field--process' : isPendingOrder}">
      <span class="order-item__status">{{ status }}</span><br>
      <Countdown
        v-if="isPendingOrder && timeLeft > 0"
        :time-left="timeLeft"
        :class="`${isCountdownRed ? 'warning' : ''}`"
        :pause-countdown="pauseCountdown"
        @time-out="$emit('time-out')"
      />
      <span v-if="!isPendingOrder" class="order-item__substatus">{{ subStatus }}</span>
    </div>
    <div class="order-item__field order-item__detail" @click="$emit('go-detail', order)">Xem chi tiết</div>
  </div>
</template>
<script>
import Countdown from '@/components/common/countdown.vue';
import CopyButton from '@/components/common/copy-button.vue';
import { STATUS_ORDER_BUY, ORDER_SELL_STEP, ORDER_BUY_STEP } from '@/resources/transfer-to-seller/index.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
export default {
  components: {
    Countdown,
    CopyButton
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    typeOrder () {
      return this.order.postType === ORDER_TYPE.SELL ? this.$t('common.buy') : this.$t('common.sell')
    },
    className () {
      return this.order.postType === ORDER_TYPE.SELL ? 'buy' : 'sell'
    },
    pauseCountdown () {
      return this.order.step === ORDER_SELL_STEP.SELL_SENDING_CRYPTO_BY_USER.name
    },
    isPendingOrder () {
      return this.order.status !== STATUS_ORDER_BUY.COMPLETED.upercaseName && this.order.status !== STATUS_ORDER_BUY.CANCELLED.upercaseName
    },
    isCountdownRed () {
      return this.isStepTimeAppeal || this.order.step === ORDER_SELL_STEP.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT.name
    },
    isStepTimeAppeal () {
      return this.order.step === ORDER_BUY_STEP.BUY_ORDER_CREATED_BY_USER_DEAL_TIME.name &&
        this.order.step === ORDER_BUY_STEP.BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME.name &&
        this.order.step === ORDER_BUY_STEP.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT.name
    },
    timeLeft () {
      const timeDown = this.order?.timeout || 0;
      if (!this.order || !timeDown) {
        return 0;
      }
      return this.$options.filters.convertToMilliseconds(timeDown);
    },
    status () {
      if (this.isPendingOrder) {
        return this.$t(`user_orders.process.${this.order.step}`)
      } else if (this.order.status === STATUS_ORDER_BUY.COMPLETED.upercaseName) {
        return this.$t('common.status.complete')
      } else {
        return this.$t('common.status.cancelled')
      }
    },
    subStatus () {
      if (this.order.status === STATUS_ORDER_BUY.CANCELLED.upercaseName) {
        if (this.order.step === ORDER_SELL_STEP.SELL_ORDER_CANCELLED_BY_USER.name) {
          return this.$t('user_orders.order-status.buyer-cancel')
        } else if (this.order.step === ORDER_BUY_STEP.BUY_ORDER_CANCELLED_BY_USER.name) {
          return this.$t('user_orders.order-status.seller-cancel')
        } else {
          return this.$t('user_orders.order-status.system-cancel')
        }
      } else {
        return ''
      }
    },
    statusPending () {
      if (this.order.status === STATUS_ORDER_BUY.TO_BE_PAID.upercaseName) {
        return this.order.type === ORDER_TYPE.BUY ? this.$t('common.status.unpaid') : this.$t('common.status.undelivered')
      } else if (this.order.status === STATUS_ORDER_BUY.CONFIRM_PAID.upercaseName) {
        return this.$t('common.status.confirm')
      } else {
        return this.order.type === ORDER_TYPE.BUY ? this.$t('common.status.paid') : this.$t('common.status.delivered')
      }
    },
    endTime () {
      return this.order.endedTime ? this.order.endedTime.substring(0, 10) + ' ' + this.order.endedTime.substring(11, 19) : ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-orders/order-item.scss" />
