<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  name: 'CustomersCare',
  middleware: 'admin-supporter',
  components: {
    Desktop: () => import('~/components/desktop/admin/customers-care/index.vue'),
    Mobile: () => import('~/components/mobile/admin/customers-care/index.vue')
  },
  extends: Base
};
</script>
