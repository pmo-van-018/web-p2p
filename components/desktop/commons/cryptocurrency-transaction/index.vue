<template>
  <div class="transaction">
    <div class="transaction__container">
      <div class="transaction__left">
        <div class="transaction__box">
          <div class="transaction__box-text">TX</div>
        </div>
      </div>
      <div class="transaction__right">
        <div class="transaction__wrapper">
          <div class="transaction__content">
            <div class="transaction__hash" @click="$_assetNetwork_openExploreTransactionHash(transaction.network, hash)">
              {{ hash | formatHash }}
            </div>
            <copy-button :value="hash" />
          </div>
          <div class="transaction__status">
            <div class="transaction__icon">
              <span v-if="iconStatus" :class="['icon', iconStatus]" />
            </div>
            <div
              :class="['transaction__status-text', statusTypeClass]"
            >
              {{ statusText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import assetNetworkMixin from '@/mixins/asset-network';

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  mixins: [assetNetworkMixin],
  props: {
    transaction: {
      type: Object,
      default: () => ({
        hash: '',
        status: ''
      })
    }
  },
  computed: {
    hash () {
      return this.transaction.hash
    },
    status () {
      return this.transaction?.status || ''
    },
    statusMapped () {
      return {
        PENDING: 'progressing',
        SUCCEED: 'successful',
        FAILED: 'failed'
      }[this.status]
    },
    iconStatus () {
      return {
        PENDING: 'icon-relaunch',
        SUCCEED: 'icon-success',
        FAILED: 'icon-circle-cancel'
      }[this.status]
    },
    statusTypeClass () {
      return this.statusMapped ? 'transaction__status-text--' + this.statusMapped : null
    },
    statusText () {
      return this.statusMapped ? this.$t(`transfer_seller.completed.transaction_info.${this.statusMapped}`) : ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/commons/cryptocurrency-transaction/index.scss">
</style>
