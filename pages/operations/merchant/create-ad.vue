<template>
  <component :is="component" />
</template>

<script>
import hiddenMenuBottom from '@/mixins/hidden-menu-bottom.js';
export default {
  layout: 'management',
  middleware: 'merchant',
  name: 'CreatePosting',
  components: {
    Desktop: () => import('@/components/desktop/merchant/create-ad/index.vue')
  },
  mixins: [hiddenMenuBottom],
  beforeCreate () {
    this.component = 'Desktop'
  }
};
</script>
