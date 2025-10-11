<template>
  <div class="order-item grey-400 font-t10m pt-2 pb-3 w-100">
    <div class="order-item__top mb-2 d-flex align-items-center justify-content-between mt-1">
      <div class="order-item__title font-t14m grey-600">
        <span v-if="order.postType === ORDER_TYPE.BUY" class="buy-color mr-1"> {{ $t('merchant.list_order.order_item.buy') }}</span>
        <span v-else class="sell-color mr-1"> {{ $t('merchant.list_order.order_item.sell') }}</span>
        {{ order.asset }}
      </div>
      <div class="order-item__cta d-flex align-items-center font-t12m" @click="showOrderDetail">
        {{ $t(status) }}
        <span class="ml-1 icon-chevron-right" />
      </div>
    </div>
    <div class="order-item__content pb-1">
      <div class="order-item__info mb-1">
        {{ $t('merchant.list_order.order_table.crypto') }}
        <span class="ml-1 grey-600 font-t12m">{{ order.amount | formatCrypto }} {{ order.asset }}</span>
      </div>
      <div class="order-item__info mb-1">
        {{ $t('label.transfer_contents') }}
        <span class="ml-1 grey-600 font-t12m">{{ order.transCode }}</span>
      </div>
      <div class="order-item__info mb-1">
        Mã lệnh
        <span class="ml-1 grey-600 font-t12m">#{{ order.orderRefId }}</span>
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <span>{{ createdTime }}</span>
      <span
        class="order-item__vnd d-flex font-t16b"
        :class="`${order.postType === ORDER_TYPE.SELL ? 'sell-color' : 'buy-color'}`"
      >
        ₫ {{ order.totalPrice | formatMoney }} <CopyButton class="ml-1" /></span>
    </div>
    <div class="d-flex align-items-center justify-content-between mt-2 mb-1">
      <div class="order-item__text grey-600">
        {{ $t(processDescript) }}
        <Countdown
          v-if="timeOut > 0"
          :time-left="timeOut"
          :class="{warning:isRedCountdown }"
          class="countdown"
        />
      </div>
      <div v-if="order.postType === ORDER_TYPE.SELL" class="action">
        <button v-if="isSubmit" disabled class="disable c-btn c-btn--small font-t10b">{{ $t('merchant.list_order.order_item.send_vndt') }}</button>
        <button v-else-if="isTobePaid" disabled class="disable c-btn c-btn--small font-t10b">{{ $t('merchant.list_order.order_item.send_vndt') }}</button>
        <button v-else-if="isSubmitAgain" class="primary c-btn c-btn--small font-t10b" @click="sendCrypto">{{ $t('merchant.list_order.order_item.send_vndt_again') }}</button>
        <button v-else class="primary c-btn c-btn--small font-t10b" @click="sendCrypto">{{ $t('merchant.list_order.order_item.send_vndt') }}</button>
      </div>
      <div v-else class="action">
        <button v-if="isShowPayButton" :disabled="isDisablePay" class="c-btn c-btn--small font-t10b primary" @click="sendCrypto">{{ $t('merchant.list_order.order_item.pay') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Countdown from '@/components/common/countdown.vue';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { STATUS_ORDER_BUY, STATUS_ORDER_SELL, ORDER_BUY_STEP, ORDER_SELL_STEP } from '@/resources/transfer-to-seller/index.js';
import { mapActions } from 'vuex';
import { MODAL } from '@/resources/modal.js';
import { FULL_DATE_FORMAT } from '@/config/constant'
import dayjs from 'dayjs'

export default {
  components: {
    Countdown,
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      ORDER_TYPE,
      MODAL
    }
  },
  computed: {
    status () {
      return this.order.postType === ORDER_TYPE.SELL
        ? STATUS_ORDER_BUY[this.order.status].text
        : STATUS_ORDER_SELL[this.order.status].text
    },
    asset () {
      return this.order.asset || ''
    },
    orderId () {
      return this.order.orderId || ''
    },
    adCode () {
      return this.order.postId || ''
    },
    createdTime () {
      return this.order.createdTime ? dayjs(this.order.createdTime).format(FULL_DATE_FORMAT) : ''
    },
    timeOut () {
      return this.$options.filters.convertToMilliseconds(this.order.timeout)
    },
    isRedCountdown () {
      const steps = [
        ORDER_BUY_STEP.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT.name,
        ORDER_SELL_STEP.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT.name
      ]
      return steps.includes(this.order.step)
    },
    processDescript () {
      return this.order.postType === ORDER_TYPE.SELL
        ? ORDER_BUY_STEP[this.order.step].descriptionForMerchant
        : ORDER_SELL_STEP[this.order.step].descriptionForMerchant
    },
    isSubmitAgain () {
      const steps = [
        ORDER_BUY_STEP.BUY_SENDING_CRYPTO_FAILED.name,
        ORDER_BUY_STEP.BUY_SENDING_CRYPTO_FAILED_APPEAL_BY_USER.name
      ]
      return steps.includes(this.order.step)
    },
    isSubmit () {
      const steps = [
        ORDER_BUY_STEP.BUY_SENDING_CRYPTO_BY_MERCHANT.name
      ]
      return steps.includes(this.order.step)
    },
    isTobePaid () {
      const steps = [
        ORDER_BUY_STEP.BUY_ORDER_CREATED_BY_USER.name,
        ORDER_BUY_STEP.BUY_ORDER_CREATED_BY_USER_DEAL_TIME.name
      ]
      return steps.includes(this.order.step)
    },
    isDisablePay () {
      const steps = [
        ORDER_SELL_STEP.SELL_ORDER_CREATED_BY_USER.name,
        ORDER_SELL_STEP.SELL_SENDING_CRYPTO_BY_USER.name,
        ORDER_SELL_STEP.SELL_SENDING_CRYPTO_FAILED.name
      ]
      return steps.includes(this.order.step)
    },
    isShowPayButton () {
      const steps = [
        ORDER_SELL_STEP.SELL_ORDER_CREATED_BY_USER.name,
        ORDER_SELL_STEP.SELL_SENDING_CRYPTO_BY_USER.name,
        ORDER_SELL_STEP.SELL_SENDING_CRYPTO_FAILED.name,
        ORDER_SELL_STEP.SELL_SENDING_CRYPTO_SUCCESS.name,
        ORDER_SELL_STEP.SELL_ENABLE_APPEAL_MERCHANT_NOT_SENDING_FIAT.name
      ]
      return steps.includes(this.order.step)
    }
  },
  methods: {
    ...mapActions('merchant-orders', ['getOrderDetail']),
    async sendCrypto () {
      await this.getOrderDetail({ type: this.order.postType, id: this.order.orderId })
      if (this.order.type === ORDER_TYPE.BUY) {
        this.$bvModal.show(MODAL.CONFIRM_ORDER)
      } else {
        this.$bvModal.show(MODAL.CONFIRM_PAY)
      }
    },
    async showOrderDetail () {
      await this.getOrderDetail({ type: this.order.postType, id: this.order.orderId })
      this.$bvModal.show(MODAL.ORDER_DETAIL)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/orders-management/order-item.scss" />
