<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  middleware: 'admin-supporter',
  components: {
    Desktop: () => import('@/components/desktop/admin/list-appeals/index.vue'),
    Mobile: () => import('@/components/mobile/admin/list-appeals/index.vue')
  },
  extends: Base
};
</script>
