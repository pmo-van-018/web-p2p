<template>
  <div class="transaction">
    <div class="transaction__container">
      <div class="transaction__inner">
        <div class="transaction__rounded" :class="statusClass">
          <div class="transaction__rounded-inner">
            <template v-if="hasTransaction">TX</template>
            <img v-else src="/assets/images/common/transaction-empty.svg">
          </div>
        </div>
      </div>
      <div class="transaction__inner">
        <div class="d-flex align-items-center">
          <slot name="title">
            <div
              class="transaction__text"
              :class="statusClass"
              @click="$_assetNetwork_openExploreTransactionHash(transaction?.network, transaction?.hash)"
            >
              {{ formatHashTransaction }}
            </div>
          </slot>
          <div v-if="hasTransaction" class="transaction__icon-copy">
            <copy-button
              :id="`transaction__copy-${hashTransaction}`"
              :value="hashTransaction"
              :text-guide="$t('role_management.label.copy_wallet_address')"
            />
          </div>
        </div>
        <div class="d-flex align-items-center">
          <div class="transaction__status" :class="statusClass">
            {{ statusText }}
          </div>
          <div v-if="isTransactionPending" class="stage">
            <div class="dot-typing" />
          </div>
          <span v-if="classIconTransaction" :class="['transaction__icon-status', 'icon', classIconTransaction]">
            <span class="path1" /><span class="path2" /><span class="path3" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { TRANSACTION_STATUS } from '@/constants/transaction'
import isEmpty from 'lodash/isEmpty'
import assetNetworkMixin from '@/mixins/asset-network';
export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  mixins: [assetNetworkMixin],
  props: {
    transaction: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    hasTransaction () {
      return !isEmpty(this.transaction)
    },
    isTransactionPending () {
      return this.transaction?.status === TRANSACTION_STATUS.PENDING
    },
    hashTransaction () {
      return this.hasTransaction ? this.transaction.hash : 'Chưa giao dịch'
    },
    formatHashTransaction () {
      return this.hasTransaction ? this.$options.filters.formatHash(this.hashTransaction) : this.hashTransaction
    },
    statusText () {
      switch (this.transaction?.status) {
        case TRANSACTION_STATUS.PENDING:
          return this.$t('transfer_seller.completed.transaction_info.progressing')
        case TRANSACTION_STATUS.FAILED:
        case TRANSACTION_STATUS.UNKNOWN:
          return this.$t('transfer_seller.completed.transaction_info.failed')
        case TRANSACTION_STATUS.SUCCEED:
          return this.$t('transfer_seller.completed.transaction_info.successful')
        default:
          return ''
      }
    },
    classIconTransaction () {
      switch (this.transaction?.status) {
        case TRANSACTION_STATUS.FAILED:
        case TRANSACTION_STATUS.UNKNOWN:
          return 'icon-circle-cancel'
        case TRANSACTION_STATUS.SUCCEED:
          return 'icon-success'
        default:
          return null
      }
    },
    statusClass () {
      switch (this.transaction?.status) {
        case TRANSACTION_STATUS.PENDING:
          return 'pending'
        case TRANSACTION_STATUS.FAILED:
        case TRANSACTION_STATUS.UNKNOWN:
          return 'failed'
        case TRANSACTION_STATUS.SUCCEED:
          return 'succeed'
        default:
          return 'empty'
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/transaction/index.scss">
</style>
