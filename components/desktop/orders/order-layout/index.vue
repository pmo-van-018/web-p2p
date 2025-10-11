<template>
  <div class="order-layout">
    <div class="order-layout__header">
      <div class="order-layout__title">{{ $t('admin.listing_appeal') }}</div>
      <div class="order-layout__nav">
        <tabs-action :tabs="tabs" :active-tab="activeTab" @on-change-tab="$emit('on-change-tab', $event)" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    TabsAction: () => import('~/components/common/tab-action/index.vue')
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    tabs: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: Number,
      default: 0
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/order-layout/index.scss">
</style>
