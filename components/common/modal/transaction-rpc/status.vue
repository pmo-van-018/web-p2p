<template>
  <div class="status-wrapper" :class="statusClass">
    <div class="status-wrapper__container">
      <div v-if="loading" class="status-wrapper__loading"></div>
      <div class="status-wrapper__text">{{ statusText }}</div>
    </div>
  </div>
</template>
<script>
import { TRANSACTION_STATUS } from '@/constants/transaction';

export default {
  props: {
    status: {
      type: String,
      require: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    loading () {
      return this.isLoading || this.status === TRANSACTION_STATUS.PENDING
    },
    statusClass () {
      if (this.isLoading) {
        return null
      }
      switch (this.status) {
        case TRANSACTION_STATUS.SUCCEED:
          return 'success'
        case TRANSACTION_STATUS.FAILED:
          return 'failed'
        default:
          return null
      }
    },
    statusText () {
      if (this.isLoading) {
        return this.$t('transaction_rpc.status.connect')
      }
      return {
        [TRANSACTION_STATUS.PENDING]: this.$t('transaction_rpc.status.pending'),
        [TRANSACTION_STATUS.SUCCEED]: this.$t('transaction_rpc.status.success'),
        [TRANSACTION_STATUS.FAILED]: this.$t('transaction_rpc.status.failed')
      }[this.status] || this.$t('transaction_rpc.status.connect')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/transaction-rpc/status.scss">
</style>
