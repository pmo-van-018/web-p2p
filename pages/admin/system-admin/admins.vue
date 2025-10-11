<template>
  <component :is="component" />
</template>

<script>
export default {
  layout: 'management',
  middleware: 'system-admin',
  components: {
    Desktop: () => import('~/components/desktop/system-admin/admins/index.vue')
  },
  beforeCreate () {
    this.component = 'Desktop'
  }
};
</script>
