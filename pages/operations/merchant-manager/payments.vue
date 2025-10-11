<template>
  <component :is="component" />
</template>

<script>
export default {
  layout: 'management',
  middleware: 'merchant-manager',
  components: {
    Mobile: () => import('~/components/mobile/merchant/payments/index.vue'),
    Desktop: () => import('~/components/desktop/merchant/payments/index.vue')
  },
  beforeCreate () {
    this.component = this.$device.isMobileOrTablet ? 'Mobile' : 'Desktop'
  }
};
</script>
