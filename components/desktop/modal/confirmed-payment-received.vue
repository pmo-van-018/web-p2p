<template>
  <b-modal
    id="modalConfirmedPaymentReceived"
    ref="modalConfirmedPaymentReceived"
    modal-class="modal-custom confirmed-payment-received"
    centered
    hide-header
    hide-footer
  >
    <div class="confirmed-payment-received__content">
      <div class="confirmed-payment-received__header">
        <div class="confirmed-payment-received__title">
          {{ $t("merchant.modal_confirm_reveice.confirmed_payment_received") }}
        </div>
        <div class="confirmed-payment-received__close" @click="close()">
          <span class="icon-cancel" />
        </div>
      </div>
      <div class="confirmed-payment-received__desc">
        {{ $t("merchant.modal_confirm_reveice.note") }}
      </div>
      <div class="confirmed-payment-received__info">
        <div class="confirmed-payment-received__info-row">
          <div class="confirmed-payment-received__info-title">
            {{ $t("merchant.modal_confirm_reveice.piat_reveice") }}
          </div>
          <div class="confirmed-payment-received__info-value">
            {{ amountMoney | formatMoney }} {{ $t("home.unit-vnd") }}
          </div>
        </div>
        <div class="confirmed-payment-received__info-row">
          <div class="confirmed-payment-received__info-title">
            {{
              $t("merchant.modal_confirm_reveice.account_reveice_information")
            }}
          </div>
          <div class="confirmed-payment-received__info-value">
            {{ bankNumber }} / {{ bankName }}
          </div>
        </div>
        <div class="confirmed-payment-received__info-row">
          <div class="confirmed-payment-received__info-title">
            {{ $t("merchant.modal_confirm_reveice.transfer_contents") }}
          </div>
          <div class="confirmed-payment-received__info-value">
            {{ bankNote }}
          </div>
        </div>
      </div>
      <b-form-checkbox
        v-model="isConfirm"
        class="primary confirmed-payment-received__checkbox"
      >
        {{ $t("merchant.modal_confirm_reveice.confirm_content") }}
      </b-form-checkbox>
      <div class="confirmed-payment-received__action">
        <button
          class="secondary confirmed-payment-received__action-btn"
          @click="close()"
        >
          {{ $t("action.close") }}
        </button>
        <button
          class="primary confirmed-payment-received__action-btn"
          :disabled="!isConfirm"
          @click="submit()"
        >
          {{ $t("action.confirm") }}
        </button>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { BANK } from '@/resources/bank.js'
export default {
  data () {
    return {
      isConfirm: false
    };
  },
  computed: {
    ...mapState('merchant-orders', ['orderDetail']),
    bankNumber () {
      return this.orderDetail.bankNumber || ''
    },
    bankName () {
      return BANK.find(e => e.bankName === this.orderDetail?.bankName)?.name || ''
    },
    bankNote () {
      return this.orderDetail.orderId || ''
    },
    amountMoney () {
      return this.orderDetail.totalPrice || 0
    }
  },
  mounted () {
    this.$root.$on('bv::modal::hidden', (bvEvent) => {
      if (bvEvent.componentId === 'modalConfirmedPaymentReceived') {
        this.isConfirm = false;
      }
    });
  },
  methods: {
    ...mapActions('merchant-orders', ['confirmPaid']),
    show () {
      this.$refs.modalConfirmedPaymentReceived.show();
    },
    close () {
      this.$refs.modalConfirmedPaymentReceived.hide();
    },
    submit () {
      this.close();
      this.confirmPaid(this.orderDetail.orderRefId);
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/confirmed-payment-received.scss"></style>
