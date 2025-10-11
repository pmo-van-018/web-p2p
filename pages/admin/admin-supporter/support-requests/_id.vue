<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  name: 'CustomersCareDetail',
  middleware: 'admin-supporter',
  components: {
    Desktop: () => import('~/components/desktop/admin/customers-care/detail/index.vue'),
    Mobile: () => import('~/components/mobile/admin/customers-care/detail/index.vue')
  },
  extends: Base
};
</script>
