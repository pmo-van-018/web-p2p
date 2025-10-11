<template>
  <div class="order-supporter">
    <div v-if="order.supporter" class="order-supporter__inner" :class="{ horizontal }">
      <div v-if="isVisibleName" class="order-supporter__info">
        <span class="order-supporter__icon icon-supporter-order" />
        <div class="order-supporter__nickname">
          {{ nickNameSupporter }}
        </div>
      </div>
      <template v-if="!viewOnly">
        <div v-if="order.appealResolved" class="order-supporter__supporter-status resolved">
          <img src="/assets/images/common/orders/supporter-resolve-appeal.svg">
          <span>{{ $t('merchant.supporter.process_status.done') }}</span>
        </div>
        <div v-else class="order-supporter__supporter-status">
          <img src="/assets/images/common/orders/supporter-processing-appeal.svg">
          <span>{{ $t('merchant.supporter.process_status.doing') }}</span>
        </div>
      </template>
    </div>
    <div v-else class="order-supporter__nickname">
      {{ '-/-' }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    isVisibleName: {
      type: Boolean,
      default: true
    },
    viewOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    nickNameSupporter () {
      return this.order?.supporter?.nickName || this.$options.filters.formatHash(this.order?.supporter?.walletAddress)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/order-supporter.scss">
</style>
