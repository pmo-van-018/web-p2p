<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  name: 'ManagementOrdersUser',
  middleware: 'authenticated-user',
  components: {
    Desktop: () => import('~/components/desktop/user/orders-management/list/index.vue'),
    Mobile: () => import('~/components/mobile/user/orders-management/list/index.vue')
  },
  extends: Base
};
</script>
