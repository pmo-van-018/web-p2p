<template>
  <ModalCommon
    :id="MODAL.STATUS_SEND_CRYPTO"
    :ref="MODAL.STATUS_SEND_CRYPTO"
    :title="$t('merchant.modal_result_send_crypto.cryptocurrency_deposit')"
  >
    <div class="result-send-crypto">
      <div class="result-send-crypto__icon">
        <animation-icon-sending-crypto v-if="resultSendCryptoInfo.status === 'PENDING'" />
        <img
          v-else
          alt="status"
          :src="srcIcon"
          class="result-send-crypto__icon-img"
        >
      </div>
      <div class="result-send-crypto__desc">
        {{ desc }}
      </div>
      <div class="result-send-crypto__note" v-html="note" />
      <div class="result-send-crypto__link">
        <div class="result-send-crypto__link-title">TX ID</div>
        <div
          class="result-send-crypto__link-content"
          @click="$_assetNetwork_openExploreTransactionHash(resultSendCryptoInfo.network, resultSendCryptoInfo.hash)"
        >
          {{ resultSendCryptoInfo.hash | formatHash }}
        </div>
        <copy-button
          :value="resultSendCryptoInfo.hash"
          class="send-crypto-result-custom"
        />
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue'
import { STATUS_TRANSACTION } from '@/resources/merchant/index.js'
import { mapState } from 'vuex'
import { MODAL } from '@/resources/modal'
import CopyButton from '@/components/common/copy-button.vue';
import assetNetworkMixin from '@/mixins/asset-network';

export default {
  components: {
    ModalCommon,
    CopyButton,
    AnimationIconSendingCrypto: () => import('~/components/common/animations/icon-sending-crypto.vue')
  },
  mixins: [assetNetworkMixin],
  data () {
    return {
      MODAL,
      statusTransaction: STATUS_TRANSACTION
    }
  },
  computed: {
    ...mapState('send-crypto', ['resultSendCryptoInfo']),
    srcIcon () {
      return STATUS_TRANSACTION[this.resultSendCryptoInfo.status]?.image
    },
    desc () {
      return this.$t(STATUS_TRANSACTION[this.resultSendCryptoInfo.status]?.desc)
    },
    note () {
      return this.$t(STATUS_TRANSACTION[this.resultSendCryptoInfo.status]?.note)
    }
  },
  watch: {
    resultSendCryptoInfo (val) {
      if (val.hash && val.network) {
        this.show();
      }
    }
  },
  methods: {
    show () {
      this.$bvModal.show(MODAL.STATUS_SEND_CRYPTO)
    },
    close () {
      this.$bvModal.hide(MODAL.STATUS_SEND_CRYPTO)
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/result-send-crypto.scss"></style>
