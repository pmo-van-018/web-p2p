<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  middleware: 'admin',
  components: {
    Desktop: () => import('~/components/desktop/admin/admin-supporter/index.vue'),
    Mobile: () => import('~/components/mobile/admin/admin-supporter/index.vue')
  },
  extends: Base
};
</script>
