<template>
  <ModalCommon
    id="modalSellConfirmedPaymentReceived"
    ref="modalSellConfirmedPaymentReceived"
    :title="$t('merchant.modal_confirm_reveice.confirmed_payment_received')"
  >
    <div class="confirmed-send-crypto">
      <div class="sell-confirmed-payment-received__desc">
        {{ $t("merchant.modal_confirm_reveice.note") }}
      </div>
      <InfoBlock :list-info="listInfo" />
      <b-form-checkbox
        v-model="isConfirm"
        class="primary sell-confirmed-payment-received__checkbox"
      >
        {{ $t("merchant.modal_confirm_reveice.confirm_content") }}
      </b-form-checkbox>
      <div class="sell-confirmed-payment-received__action">
        <button
          class="secondary sell-confirmed-payment-received__action-btn"
          @click="close()"
        >
          {{ $t("action.close") }}
        </button>
        <button
          class="primary sell-confirmed-payment-received__action-btn"
          :disabled="!isConfirm"
          @click="submit()"
        >
          {{ $t("action.payment_confirmation") }}
        </button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import InfoBlock from '@/components/common/info-block.vue';
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { mapState } from 'vuex';
import { BANK } from '@/resources/bank.js';
export default {
  components: {
    InfoBlock,
    ModalCommon
  },
  data () {
    return {
      isConfirm: false
    };
  },
  computed: {
    ...mapState('end-user', ['buyOrderInfo']),
    bankNumber () {
      return this.buyOrderInfo?.bankNumber ? this.buyOrderInfo.bankNumber : ''
    },
    bankName () {
      return BANK.find(e => e.bankName === this.buyOrderInfo?.bankName)?.name || ''
    },
    bankNote () {
      return this.buyOrderInfo?.orderId || ''
    },
    amountMoney () {
      return this.buyOrderInfo?.totalPrice ? this.buyOrderInfo.totalPrice : 0
    },
    listInfo () {
      return [
        {
          title: this.$t('merchant.modal_confirm_reveice.piat_reveice'),
          value: `${this.$options.filters.formatMoney(this.amountMoney)} ${this.$t('home.unit-vnd')}`
        },
        {
          title: this.$t('merchant.modal_confirm_reveice.account_reveice_information'),
          value: `${this.bankNumber} / ${this.bankName}`
        },
        {
          title: this.$t('merchant.modal_confirm_reveice.transfer_contents'),
          value: this.bankNote.toString()
        }
      ]
    }
  },
  mounted () {
    this.$root.$on('bv::modal::hidden', (bvEvent) => {
      if (bvEvent.componentId === 'modalSellConfirmedPaymentReceived') {
        this.isConfirm = false;
      }
    });
  },
  methods: {
    show () {
      this.$refs.modalSellConfirmedPaymentReceived.show();
    },
    close () {
      this.$refs.modalSellConfirmedPaymentReceived.close();
    },
    submit () {
      this.close();
      this.$emit('confirmedPaymentReceived');
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/sell-confirmed-payment-received.scss"></style>
