<template>
  <div class="transfer-status" :class="className">
    <div v-b-tooltip :title="$t('transfer_seller.completed.transaction_info.note')" class="transfer-status__note">TX</div>
    <div class="transfer-status__content">
      <div class="transfer-status__hash">
        <div class="transfer-status__hash-text" @click="checkHash">{{ transaction.hash | formatHash }}</div>
        <CopyButton :value="transaction.hash" />
      </div>
      <template v-if="!hideStatus">
        <div v-if="status === sendCryptoStatus.PROCESSING" class="transfer-status__status processing">
          <span class="icon-loading"><span class="path1" /><span class="path2" /></span>
          {{ $t('transfer_seller.completed.transaction_info.progressing') }}
        </div>
        <div v-else-if="status === sendCryptoStatus.FAILED" class="transfer-status__status failed">
          <span class="icon-circle-cancel"><span class="path1" /><span class="path2" /><span class="path3" /></span>
          {{ $t('transfer_seller.completed.transaction_info.failed') }}
        </div>
        <div v-else class="transfer-status__status successful">
          <span class="icon-success" /> {{ $t('transfer_seller.completed.transaction_info.successful') }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { SEND_CRYPTO_STATUS } from '@/resources/send-crypto.js';
import CopyButton from '@/components/common/copy-button.vue';
import { mapGetters } from 'vuex';
import assetNetworkMixin from '@/mixins/asset-network';

export default {
  components: { CopyButton },
  mixins: [assetNetworkMixin],
  props: {
    className: {
      type: String,
      default: ''
    },
    transaction: {
      type: Object,
      default: () => {}
    },
    hideStatus: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'successful'
    }
  },
  data () {
    return {
      sendCryptoStatus: SEND_CRYPTO_STATUS
    }
  },
  computed: {
    ...mapGetters('resources', ['networkConfigs'])
  },
  methods: {
    checkHash () {
      this.$_assetNetwork_openExploreTransactionHash(this.transaction?.network, this.transaction?.hash)
    }
  }
}
</script>
<style
  lang="scss"
  scoped
src="static/assets/scss/components/common/transfer-to-seller/transfer-status.scss"
/>
