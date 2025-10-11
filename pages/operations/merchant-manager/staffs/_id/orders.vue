<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  middleware: 'merchant-manager',
  name: 'OrderMerchantOperator',
  components: {
    Desktop: () => import('~/components/desktop/merchant-manager/staffs/orders/index.vue'),
    Mobile: () => import('~/components/mobile/merchant-manager/staffs/orders/index.vue')
  },
  extends: Base
};
</script>
