<template>
  <component :is="component" />
</template>

<script>
export default {
  layout: 'management',
  middleware: 'manager',
  components: {
    Desktop: () => import('~/components/desktop/merchant-manager/post-detail/index.vue')
  },
  beforeCreate () {
    this.component = 'Desktop'
  }
};
</script>
