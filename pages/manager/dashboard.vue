<template>
  <overview-component :is-mobile="$device.isMobileOrTablet" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  name: 'ManagementDashboard',
  layout: 'management',
  middleware: 'manager',
  components: {
    OverviewComponent: () => import('~/components/desktop/manager/dashboard/index.vue')
  },
  extends: Base
};
</script>
