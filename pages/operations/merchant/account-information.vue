<template>
  <component :is="component" />
</template>

<script>
export default {
  layout: 'management',
  middleware: 'merchant',
  components: {
    Desktop: () => import('~/components/desktop/merchant/account-information/index.vue')
  },
  beforeCreate () {
    this.component = 'Desktop'
  }
};
</script>
