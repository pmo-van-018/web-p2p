<template>
  <section class="dashboard-transaction">
    <div class="dashboard-transaction__head">
      <h3 class="dashboard-transaction__title">
        <img src="/assets/icons/30-days.svg" alt="30 days">
        {{ $t("overview.transaction_in_month") }}
      </h3>
      <div class="dashboard-transaction__sub-title">
        {{ $t("overview.total_transaction") }}
      </div>
    </div>
    <dashboard-transaction-card
      v-for="(overview, index) in overviewData"
      :key="`dashboard-transaction-${index}`"
      :overview="overview"
    />
  </section>
</template>
<script>
export default {
  components: {
    DashboardTransactionCard: () => import('~/components/desktop/dashboard/components/dashboard-transaction-card.vue')
  },
  props: {
    overviewData: {
      type: Array,
      default: () => []
    },
    overviewUser: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    id () {
      return 'transaction-card' + Math.random()
    },
    placement () {
      return 'top';
    },
    tooltipTextGuideTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/dashboard/components/dashboard-transaction.scss">
</style>
