<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  middleware: 'supporter',
  components: {
    Desktop: () => import('@/components/desktop/supporter/orders/index.vue'),
    Mobile: () => import('@/components/mobile/supporter/orders/index.vue')
  },
  extends: Base
};
</script>
