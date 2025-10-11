<template>
  <ModalCommon
    id="modalSendCryptoResult"
    ref="modalSendCryptoResult"
    :title="$t('modal.send_crypto_result.title')"
    :modal-class="`${modalClass}`"
    @hide-modal="$emit('hide-modal')"
  >
    <template #countdown>
      <Countdown
        v-if="timeLeft > 0"
        :time-left="timeLeft"
        :pause-countdown="isSellSendingCryptoByUser"
        :is-visible-mercy-loading="isVisibleMercyLoading"
        class="ml-md-3 ml-0 mt-1 mt-md-0"
      />
    </template>
    <div class="send-crypto-result" :class="modalClass">
      <div class="send-crypto-result__icon">
        <animation-icon-sending-crypto v-if="isProcessing" />
        <img
          v-else
          alt="result"
          :src="srcIcon"
          class="send-crypto-result__icon-img"
          :class="{'send-crypto-result__icon-img--rote': isSellSendingCryptoByUser}"
        >
      </div>
      <div class="send-crypto-result__desc" :class="{'send-crypto-result__desc--red': !isSellSendingCryptoByUser}">
        {{ desc }}
      </div>
      <div class="send-crypto-result__note" v-html="note" />
      <div class="send-crypto-result__link">
        <div class="send-crypto-result__link-title">TX ID</div>
        <div
          class="send-crypto-result__link-content"
          @click="$_assetNetwork_openExploreTransactionHash(lastTransaction?.network, lastTransaction?.hash)"
        >
          {{ lastTransaction?.hash | formatHash }}
        </div>
        <CopyButton :value="lastTransaction?.hash" class="send-crypto-result-custom" />
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import Countdown from '@/components/common/countdown.vue';
import CopyButton from '@/components/common/copy-button.vue';
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { ORDER_SELL_STEP } from '@/resources/transfer-to-seller/index.js';
import assetNetworkMixin from '@/mixins/asset-network';
import { TRANSACTION_STATUS } from '@/constants/transaction';

export default {
  components: {
    ModalCommon,
    Countdown,
    CopyButton,
    AnimationIconSendingCrypto: () => import('~/components/common/animations/icon-sending-crypto.vue')
  },
  mixins: [assetNetworkMixin],
  props: {
    orderInfo: {
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
    }
  },
  computed: {
    isSellSendingCryptoByUser () {
      return this.orderInfo?.step === ORDER_SELL_STEP.SELL_SENDING_CRYPTO_BY_USER.name
    },
    isSellSendingCryptoSuccess () {
      return this.orderInfo?.step === ORDER_SELL_STEP.SELL_SENDING_CRYPTO_SUCCESS.name
    },
    isProcessing () {
      return (this.isSellSendingCryptoByUser && this.isTransactionPending) || this.isSellSendingCryptoSuccess
    },
    srcIcon () {
      if (this.isProcessing) {
        return '/assets/images/common/orders/transfer-processing.svg'
      } else {
        return '/assets/images/common/orders/transfer-fail.svg'
      }
    },
    desc () {
      return this.isProcessing
        ? this.$t('modal.send_crypto_result.desc_processing')
        : this.$t('modal.send_crypto_result.desc_failed')
    },
    note () {
      return this.isProcessing
        ? this.$t('modal.send_crypto_result.note_processing')
        : this.$t('modal.send_crypto_result.note_failed')
    },
    lastTransaction () {
      return this.orderInfo?.transactions?.length ? this.orderInfo.transactions[this.orderInfo.transactions.length - 1] : null
    },
    isTransactionPending () {
      return this.lastTransaction?.status === TRANSACTION_STATUS.PENDING
    }
  },
  methods: {
    showPopup () {
      this.$refs.modalSendCryptoResult.show();
    },
    closePopup () {
      this.$refs.modalSendCryptoResult.close();
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/send-crypto-result.scss"></style>
