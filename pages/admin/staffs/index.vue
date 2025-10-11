<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  middleware: 'admin',
  components: {
    Desktop: () => import('~/components/desktop/admin/staffs/index.vue'),
    Mobile: () => import('~/components/mobile/admin/staffs/index.vue')
  },
  extends: Base
};
</script>
