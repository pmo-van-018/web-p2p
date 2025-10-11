<template>
  <component :is="component" />
</template>

<script>
export default {
  layout: 'management',
  middleware: 'merchant',
  components: {
    Mobile: () => import('~/components/mobile/merchant/postings-history/index.vue'),
    Desktop: () => import('~/components/desktop/merchant/postings-history/index.vue')
  },
  beforeCreate () {
    this.component = this.$device.isMobileOrTablet ? 'Mobile' : 'Desktop'
  }
};
</script>
