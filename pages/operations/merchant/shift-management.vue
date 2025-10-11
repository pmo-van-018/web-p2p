<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  middleware: 'merchant',
  name: 'ShiftManagementMerchantOperator',
  components: {
    Desktop: () => import('~/components/desktop/merchant/shift-management/index.vue')
  },
  extends: Base
};
</script>
