<template>
  <div :id="`copy-info-${order.orderId}-${revisedRandId}`" class="copy-all-info">
    <copy-all-button
      :id="`copy-info-order-${order.orderId}-${revisedRandId}`"
      :value="formatterInfoOfOrder"
      placement="bottom"
    />
    <b-tooltip :target="`copy-info-${order.orderId}-${revisedRandId}`" :triggers="tooltipTrigger">
      {{ $t('common.copy_all_info') }}
    </b-tooltip>
  </div>
</template>
<script>
import { hiddenAsteriskString } from '@/helper';

export default {
  components: {
    CopyAllButton: () => import('@/components/common/copy-all-button.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    hiddenBankName: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    revisedRandId () {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substring(2, 10);
    },
    bankNumber () {
      if (this.hiddenBankName) {
        return hiddenAsteriskString(this.order?.bankNumber)
      }
      return this.order?.bankNumber || ''
    },
    tooltipTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    },
    formatterInfoOfOrder () {
      return `
      ${this.$t('order.copy_info.code')}: #${this.order.orderRefId}
      ${this.$t('order.copy_info.created_at')}: ${this.$options.filters.formatDateTime(this.order?.createdTime)}
      ${this.$t('order.copy_info.holder')}: ${this.order.bankAccountName}
      ${this.$t('order.copy_info.bank')}: ${this.order.bankName}
      ${this.$t('order.copy_info.number_account')}: ${this.bankNumber}
      ${this.$t('order.copy_info.trans_code')}: ${this.order.transCode}
      ${this.$t('order.copy_info.amount')}: ${this.order?.fiatSymbol || ''} ${this.$options.filters.formatMoney(this.order?.totalPrice || 0)}
      `
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/copy-all-info-payment/index.scss">
</style>
