<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';

export default {
  layout: 'management',
  middleware: 'admin',
  components: {
    Desktop: () => import('~/components/desktop/merchant/dashboard/index.vue'),
    Mobile: () => import('~/components/mobile/merchant/dashboard/index.vue')
  },
  extends: Base
};
</script>

<style lang="scss" scoped>
@import "static/assets/scss/components/desktop/role-management/index.scss";
@import "static/assets/scss/components/desktop/admin/staffs/index.scss";
</style>
