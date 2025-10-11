<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  name: 'ManagementOrders',
  middleware: 'merchant',
  components: {
    Desktop: () => import('~/components/desktop/merchant/orders-management/list/index.vue'),
    Mobile: () => import('~/components/mobile/merchant/orders-management/list/index.vue')
  },
  extends: Base
};
</script>
