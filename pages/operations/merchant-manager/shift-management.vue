<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  middleware: 'merchant-manager',
  name: 'ShiftManagementMerchantManager',
  components: {
    Desktop: () => import('~/components/desktop/merchant-manager/shift-management/index.vue')
  },
  extends: Base
};
</script>
