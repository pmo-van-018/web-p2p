<template>
  <div>
    <div v-show="!activeItem" class="order-item">
      <div class="order-info">
        <div
          v-if="order.postType === ORDER_TYPE.BUY"
          class="order-info__type bullish-green"
        >
          {{ $t("merchant.list_order.order_item.buy") }}
        </div>
        <div v-else class="order-info__type bearish-red">
          {{ $t("merchant.list_order.order_item.sell") }}
        </div>
        <div class="order-info__content">
          <div
            :id="order.orderId.toString()"
            class="order-info__text"
            @click="$emit('onselect')"
          >
            #123213{{ order.orderRefId }}
          </div>
          <b-tooltip
            v-show="!activeItem"
            :target="order.orderId.toString()"
            triggers="hover"
            placement="top"
          >
            <span>{{ $t("merchant.list_order.order_item.see_detail") }}</span>
          </b-tooltip>
          <div class="order-info__status">{{ $t(statusOrder) }}</div>
        </div>
      </div>
      <div class="amount">
        <div
          class="amount__vnd d-flex align-items-center"
          :class="
            order.postType === ORDER_TYPE.BUY ? 'bullish-green' : 'bearish-red'
          "
        >
          {{ order.fiatSymbol }} {{ order.totalPrice | formatMoney }}
          <CopyButton
            id="copy-total-price"
            :value="order.totalPrice | formatMoney"
          />
        </div>
        <div class="amount__crypto">
          {{ order.amount | formatCrypto }} {{ order.asset }}
        </div>
      </div>
      <div class="transfer-content">
        <div class="d-flex align-items-center grey-600">
          {{ order.transCode }}
          <CopyButton id="copy-transfer-code" :value="order.transCode" />
        </div>
      </div>
      <div class="progressing">
        <div>
          <div class="progressing-text">{{ $t(processDescript) }}</div>
          <div class="progressing-timer">
            <Countdown
              v-if="timeOut > 0"
              :time-left="timeOut"
              :class="{ warning: isRedCountdown }"
              class="mt-1"
            />
          </div>
        </div>
        <!-- <span :id="'icon-hammer'+order.orderId.toString()" class="icon-hammer" /> -->
        <!-- <b-tooltip :target="'icon-hammer'+order.orderId.toString()" triggers="hover" placement="top">Phản hồi khiếu nại</b-tooltip> -->
      </div>
      <div v-if="order.postType === ORDER_TYPE.SELL" class="action">
        <button v-if="isSubmit" disabled class="disable action-btn">
          <span class="icon-transfer" />{{
            $t("merchant.list_order.order_item.send_vndt")
          }}
        </button>
        <button v-else-if="isTobePaid" disabled class="disable action-btn">
          {{ $t("merchant.list_order.order_item.send_vndt") }}
        </button>
        <button
          v-else-if="isSubmitAgain"
          class="primary action-btn"
          @click="sendCrypto"
        >
          <span class="icon-transfer-again" />{{
            $t("merchant.list_order.order_item.send_vndt_again")
          }}
        </button>
        <button v-else class="primary action-btn" @click="sendCrypto">
          {{ $t("merchant.list_order.order_item.send_vndt") }}
        </button>
      </div>
      <div v-else class="action">
        <button
          v-if="isShowPayButton"
          :disabled="isDisablePay"
          class="primary action-btn"
          @click="sendCrypto"
        >
          {{ $t("merchant.list_order.order_item.pay") }}
        </button>
      </div>
    </div>
    <Detail
      :active="activeItem"
      :order-detail="order"
      @click="$emit('cancel')"
      @confirm="sendCrypto"
    />
  </div>
</template>

<script>
import {
  STATUS_ORDER_BUY,
  STATUS_ORDER_SELL,
  ORDER_BUY_STEP,
  ORDER_SELL_STEP
} from '@/resources/transfer-to-seller/index.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import Countdown from '@/components/common/countdown.vue';
import { MODAL } from '@/resources/modal.js';
import { mapActions } from 'vuex';
import CopyButton from '@/components/common/copy-button.vue';
import Detail from './order-detail.vue';
export default {
  components: { Detail, Countdown, CopyButton },
  props: {
    activeItem: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ORDER_TYPE () {
      return ORDER_TYPE
    },
    statusOrder () {
      return this.order.postType === ORDER_TYPE.SELL
        ? STATUS_ORDER_BUY[this.order.status].text
        : STATUS_ORDER_SELL[this.order.status].text
    },
    processDescript () {
      return this.order.postType === ORDER_TYPE.SELL
        ? ORDER_BUY_STEP[this.order.step].descriptionForMerchant
        : ORDER_SELL_STEP[this.order.step].descriptionForMerchant
    },
    timeOut () {
      return this.$options.filters.convertToMilliseconds(this.order.timeout)
    },
    isSubmitAgain () {
      const steps = [
        ORDER_BUY_STEP.BUY_SENDING_CRYPTO_FAILED.name,
        ORDER_BUY_STEP.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED.name
      ]
      return steps.includes(this.order.step)
    },
    isSubmit () {
      const steps = [ORDER_BUY_STEP.BUY_SENDING_CRYPTO_BY_MERCHANT.name]
      return steps.includes(this.order.step)
    },
    isTobePaid () {
      const steps = [
        ORDER_BUY_STEP.BUY_ORDER_CREATED_BY_USER.name,
        ORDER_BUY_STEP.BUY_ORDER_CREATED_BY_USER_DEAL_TIME.name
      ]
      return steps.includes(this.order.step)
    },
    isRedCountdown () {
      const steps = [
        ORDER_BUY_STEP.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT.name,
        ORDER_SELL_STEP.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT.name
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
      await this.getOrderDetail({
        type: this.order.postType,
        id: this.order.orderId
      });
      if (this.order.postType === ORDER_TYPE.SELL) {
        this.$bvModal.show(MODAL.CONFIRM_ORDER)
      } else {
        this.$bvModal.show(MODAL.CONFIRM_PAY)
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/order-item.scss" />
