<template>
  <div>
    <div
      class="order-detail__footer"
    >
      <div class="footer-left-content">
        <div class="desc">{{ $t(actionDescription) }}</div>
        <Countdown v-if="Boolean(timeout)" :key="orderDetail.orderId" :time-left="timeout" @time-out="getDetailOrder" />
      </div>
      <button class="primary" @click="confirm">
        {{ $t("merchant.transaction_detail.footer_btn_5") }}
      </button>
    </div>
    <ModalPaymentConfirmation ref="modalPaymentConfirmation" :order="orderDetail" />
  </div>
</template>
<script>
import { STATUS_ORDER_BUY } from '@/resources/transfer-to-seller/index.js';
import { mapActions } from 'vuex';
import Countdown from '@/components/common/countdown.vue';

const FAKE_TIMEOUT = 900000
export default {
  components: {
    ModalPaymentConfirmation: () => import('@/components/common/modal/payment-confirmation.vue'),
    Countdown
  },
  props: {
    orderDetail: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    timeout () {
      return FAKE_TIMEOUT;
    },
    actionDescription () {
      return this.orderDetail.status ? STATUS_ORDER_BUY.PAID.merchant.footerDetailText : ''
    }
  },
  methods: {
    ...mapActions('merchant', ['getBuyInfoDetail']),
    confirm () {
      this.$refs.modalPaymentConfirmation && this.$refs.modalPaymentConfirmation.show();
    },
    getDetailOrder () {
      const orderId = this.$route.query.orderId;
      if (orderId) {
        this.getBuyInfoDetail(orderId);
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-footer.scss" />
