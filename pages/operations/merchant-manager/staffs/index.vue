<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  middleware: 'merchant-manager',
  components: {
    Desktop: () => import('~/components/desktop/merchant-manager/staffs/index.vue'),
    Mobile: () => import('~/components/mobile/merchant-manager/staffs/index.vue')
  },
  extends: Base
};
</script>
