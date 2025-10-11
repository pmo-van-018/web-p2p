<template>
  <div class="type-support">
    <div class="type-support__inner">
      <div class="type-support__icon">
        <img :src="itemTypeSupport.imageUrl" :alt="itemTypeSupport.text">
      </div>
      <div class="type-support__text">{{ itemTypeSupport.text }}</div>
    </div>
  </div>
</template>
<script>
import { CUSTOMER_SUPPORT_TYPE } from '@/constants/customer-support'

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    itemTypeSupport () {
      const type = this.item?.type ? Number(this.item?.type) : CUSTOMER_SUPPORT_TYPE.OTHER
      switch (type) {
        case CUSTOMER_SUPPORT_TYPE.ORDER:
          return {
            imageUrl: '/assets/images/common/customer-request/transfer.svg',
            text: this.$t('customer_care.types.order')
          }
        case CUSTOMER_SUPPORT_TYPE.TRANSACTION:
          return {
            imageUrl: '/assets/images/common/customer-request/transaction.svg',
            text: this.$t('customer_care.types.transaction')
          }
        case CUSTOMER_SUPPORT_TYPE.APPEAL:
          return {
            imageUrl: '/assets/images/common/customer-request/appeal.svg',
            text: this.$t('customer_care.types.appeal')
          }
        case CUSTOMER_SUPPORT_TYPE.SYSTEM:
          return {
            imageUrl: '/assets/images/common/customer-request/system.svg',
            text: this.$t('customer_care.types.system')
          }
        case CUSTOMER_SUPPORT_TYPE.REGISTRATION_MANAGER:
          return {
            imageUrl: '/assets/images/common/customer-care/manager-registration.svg',
            text: this.$t('customer_care.types.manager')
          }
        default:
          return {
            imageUrl: '/assets/images/common/customer-request/other.svg',
            text: this.$t('customer_care.types.other')
          }
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/customer-care/type-support.scss">
</style>
