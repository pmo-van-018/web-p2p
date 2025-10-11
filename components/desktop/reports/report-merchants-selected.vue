<template>
  <div class="merchant-selected">
    <div class="merchant-selected__container">
      <div v-for="merchant in merchants" :key="merchant.id" class="merchant-selected__content" :id="`merchant-${merchant?.id}`">
        <span class="merchant-selected__text">{{ merchant.nickName }}</span>
        <span class="icon-cancel" @click.stop="onRemoveMerchantSelected(merchant)" />
        <b-tooltip :target="`merchant-${merchant?.id}`" :triggers="$device.isMobileOrTablet ? 'focus' : 'hover'">
          {{ merchant.walletAddress }}
        </b-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    merchants: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onRemoveMerchantSelected (item) {
      const merchants = this.merchants.filter(merchant => merchant.id !== item.id)
      this.$emit('on-remove', merchants)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/reports/report-merchants-selected.scss">
</style>
