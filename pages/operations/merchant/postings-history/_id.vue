<template>
  <component :is="component" />
</template>

<script>
export default {
  layout: 'management',
  components: {
    Mobile: () => import('~/components/mobile/merchant/postings-history/detail.vue'),
    Desktop: () => import('~/components/desktop/merchant/postings-history/detail.vue')
  },
  beforeCreate () {
    this.component = this.$device.isMobileOrTablet ? 'Mobile' : 'Desktop'
  }
};
</script>
