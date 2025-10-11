<template>
  <ModalCommon
    id="modalSellPaymentConfirmation"
    ref="modalSellPaymentConfirmation"
    :title="$t('merchant.modal_confirm_reveice.confirmed_payment_received')"
    :modal-class="`payment-confirm-custom ${modalClass}`"
    @hide-modal="hideModal"
  >
    <template #countdown>
      <Countdown
        v-if="timeLeft > 0"
        :time-left="timeLeft"
        :is-visible-mercy-loading="isVisibleMercyLoading"
        class="sell-payment-confirmation__countdown"
        :class="{ warning: isWarning }"
        @time-out="onTimeOut"
      />
    </template>
    <div class="sell-payment-confirmation" :class="modalClass">
      <img class="sell-payment-confirmation__icon" :src="require('~imageRoot/common/orders/recieved.svg')" alt="icon recieved">
      <div class="sell-payment-confirmation__title">
        {{ $t('home.sell') }}
        <span>{{ `#${ refId }` }}</span>
      </div>
      <div class="sell-payment-confirmation__desc mb-1" v-html="$t('modal.sell_payment_confirmation.confirm_received_enough_money', { value: amount })" />
      <div class="sell-payment-confirmation__desc">
        {{ $t('modal.sell_payment_confirmation.transfer_content') }}
        <span>{{ transCode }}<CopyButton :value="transCode" /></span>
      </div>
      <b-form-checkbox v-model="isConfirm" class="primary sell-payment-confirmation__checkbox">{{ $t('modal.sell_payment_confirmation.received_money_from_buyer') }}</b-form-checkbox>
      <hr class="sell-payment-confirmation__line">
      <div class="sell-payment-confirmation__action">
        <base-button
          variants="contained"
          color="primary"
          full-width
          :disabled="!isConfirm"
          @click="submit"
        >
          {{ $t('action.confirm') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import CopyButton from '@/components/common/copy-button.vue';
import Countdown from '@/components/common/countdown.vue';
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { SELL_ORDER_STEPS } from '@/constants/orders';
export default {
  components: {
    CopyButton,
    Countdown,
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    sellOrderInfo: {
      type: Object,
      default: () => {}
    },
    timeLeft: {
      type: Number,
      default: 0
    },
    modalClass: {
      type: String,
      default: ''
    },
    isVisibleMercyLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isConfirm: false
    }
  },
  computed: {
    refId () {
      return this.sellOrderInfo?.id || ''
    },
    transCode () {
      return this.sellOrderInfo?.transCode || ''
    },
    amount () {
      return `${this.sellOrderInfo?.fiatSymbol || ''} ${this.$options.filters.formatMoney(this.sellOrderInfo?.totalPrice || 0)}`
    },
    isWarning () {
      return this.sellOrderInfo?.step === SELL_ORDER_STEPS.SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT
    }
  },
  methods: {
    showPopup () {
      this.$refs.modalSellPaymentConfirmation.show();
    },
    closePopup () {
      this.$refs.modalSellPaymentConfirmation.close();
    },
    onTimeOut () {
      if (!this.isVisibleMercyLoading) {
        this.$refs.modalSellPaymentConfirmation.close();
      }
    },
    submit () {
      this.closePopup();
      this.$emit('submit-confirm-payment')
    },
    hideModal () {
      this.isConfirm = false
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/sell-payment-confirmation.scss"></style>
