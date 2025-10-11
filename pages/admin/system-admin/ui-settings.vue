<template>
  <component :is="component" />
</template>

<script>
export default {
  layout: 'management',
  middleware: 'system-admin',
  components: {
    Desktop: () => import('~/components/desktop/system-admin/ui-settings/index.vue')
  },
  beforeCreate () {
    this.component = 'Desktop'
  }
};
</script>
