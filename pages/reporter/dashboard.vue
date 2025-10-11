<template>
  <div class="w-100">
    <chart-dashboard :visible-nick-name="false" />
  </div>
</template>

<script>
export default {
  layout: 'reporter',
  middleware: 'reporter',
  components: {
    ChartDashboard: () => import('~/components/desktop/reporter/chart-dashboard/index.vue')
  }
};
</script>
