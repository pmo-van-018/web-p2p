<template>
  <ModalCommon
    id="modalPaymentCancellation"
    ref="modalPaymentCancellation"
    :title="$t('label.payment_cancellation')"
    :modal-class="`payment-cancel-custom ${modalClass}`"
  >
    <div class="payment-cancellation" :class="modalClass">
      <div class="payment-cancellation__img">
        <img src="/assets/images/common/orders/cancelled.svg" alt="cancellation icon">
      </div>
      <div class="payment-cancellation__desc" v-html="desc" />
      <div class="payment-cancellation__note">
        <div class="payment-cancellation__note-group">
          <span class="icon-question payment-cancellation__note-icon" />
          <span v-show="isMobile" class="note">{{ $t('home.note') }}</span>
        </div>
        <div class="payment-cancellation__note-desc">{{ noteDesc }}</div>
      </div>
      <div v-if="!$device.isMobileOrTablet && !cfTokenTurnstile" class="payment-cancellation__verify">
        <cf-turnstile :verify="isVerify" :is-remove="false" @challenge="onVerifiedResult" />
      </div>
      <div class="payment-cancellation__action">
        <base-button class="payment-cancellation__action-btn" variants="outlined" full-width color="grey" @click="close">
          {{ $t('action.close') }}
        </base-button>
        <base-button
          class="payment-cancellation__action-btn"
          variants="contained"
          color="danger"
          full-width
          :disabled="!$device.isMobileOrTablet && !cfTokenTurnstile"
          @click="submit"
        >
          {{ $t('action.payment_cancellation') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { ORDER_TYPE } from '@/resources/order-type.js';

export default {
  components: {
    ModalCommon,
    CfTurnstile: () => import('~/components/common/cf-turnstile/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    orderId: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: ORDER_TYPE.BUY
    },
    modalClass: {
      type: String,
      default: ''
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isVerify: false,
      cfTokenTurnstile: ''
    }
  },
  computed: {
    desc () {
      return this.type === ORDER_TYPE.SELL
        ? this.$t('end_user_sell.info.modal_question', { id: '#' + this.orderId })
        : this.$t('end_user_sell.info.modal_question2', { id: '#' + this.orderId })
    },
    noteDesc () {
      return this.type === ORDER_TYPE.SELL
        ? this.$t('end_user_sell.info.modal_note_1')
        : this.$t('end_user_sell.info.modal_note_2')
    }
  },
  methods: {
    onVerifiedResult (token) {
      this.isVerify = false
      this.cfTokenTurnstile = token
    },
    show () {
      this.isVerify = true;
      this.isDisabledConfirm = true;
      this.$refs.modalPaymentCancellation.show();
    },
    close () {
      this.$refs.modalPaymentCancellation.close();
    },
    submit () {
      this.close();
      this.$emit('submit-cancel-payment', this.cfTokenTurnstile)
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/payment-cancellation.scss"></style>
