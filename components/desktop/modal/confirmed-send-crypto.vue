<template>
  <ModalCommon
    :id="MODAL.CONFIRM_SEND_CRYPTO"
    :ref="MODAL.CONFIRM_SEND_CRYPTO"
    :title="$t('merchant.modal_confirm_send_crypto.cryptocurrency_deposit_confirmation')"
  >
    <template #countdown>
      <Countdown
        v-if="showCountdownOrderDetail && timeOut > 0"
        class="ml-3"
        :time-left="timeOut"
        :class="{ warning: false }"
        :is-visible-mercy-loading="isVisibleMercyLoading"
        @time-out="close"
      />
    </template>
    <div class="confirmed-send-crypto">
      <div class="confirmed-send-crypto__icon">
        <span class="confirmed-send-crypto__icon-img" :class="iconName" />
      </div>
      <div v-if="confirmSendCryptoInfo.status === 'failed'" class="confirmed-send-crypto__desc red">
        {{ $t('merchant.modal_confirm_send_crypto.confirm_transaction_failed') }}
      </div>
      <div v-else class="confirmed-send-crypto__desc">
        {{ $t('merchant.modal_confirm_send_crypto.amount_send') }} {{ confirmSendCryptoInfo.amount | formatMoney }} {{ $t('home.unit-vndt') }}
      </div>
      <div class="confirmed-send-crypto__note" v-html="note" />
    </div>
  </ModalCommon>
</template>
<script>
import Countdown from '@/components/common/countdown.vue';
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { ORDER_BUY_STEP } from '@/resources/transfer-to-seller';
import { mapState } from 'vuex';
import { MODAL } from '@/resources/modal'

export default {
  components: {
    ModalCommon,
    Countdown
  },
  props: {
    showCountdownOrderDetail: {
      type: Boolean,
      default: false
    },
    isVisibleMercyLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      MODAL
    }
  },
  computed: {
    ...mapState('send-crypto', ['confirmSendCryptoInfo']),
    ...mapState('merchant-orders', ['orderDetail']),
    iconName () {
      switch (this.confirmSendCryptoInfo.status) {
        case 'failed':
          return 'icon-card-remove'
        default:
          return 'icon-card-coin'
      }
    },
    timeOut () {
      return this.$options.filters.convertToMilliseconds(
        this.orderDetail?.timeout
      );
    },
    isRedCountdown () {
      const steps = [
        ORDER_BUY_STEP.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT.name
      ];
      return steps.includes(this.orderDetail?.step);
    },
    note () {
      return this.confirmSendCryptoInfo.status === 'failed'
        ? this.$t('merchant.modal_confirm_send_crypto.note_failed')
        : this.$t('merchant.modal_confirm_send_crypto.note_processing')
    }
  },
  methods: {
    show () {
      this.$refs.modalConfirmedSendCrypto.show();
    },
    close () {
      this.$refs.modalConfirmedSendCrypto.close();
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/confirmed-send-crypto.scss"></style>
