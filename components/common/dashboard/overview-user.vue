<template>
  <div class="overview__content">
    <div class="dashboard-user-transaction__container">
      <div
        class="dashboard-user-transaction__content dashboard-user-transaction__content--main px-3"
      >
        <dashboard-transaction-card
          :overview="{
            title: $t('overview.trans_all.title'),
            note: $t('overview.trans_all.note'),
            content:
              plusTwoNumber(
                overviewUser?.totalTransactionBuy,
                overviewUser?.totalTransactionSell
              ) || 0,
            totalTransactionBuy: overviewUser?.totalTransactionBuy || 0,
            totalTransactionSell: overviewUser?.totalTransactionSell || 0,
            symbol: $t('merchant.overview.times'),
            icon: '/assets/icons/dashboard/all-transaction.svg',
            type: 'main',
          }"
        />
        <div class="dashboard-user-transaction__wrapper mt-3">
          <dashboard-transaction-card
            :overview="{
              title: $t('overview.registered.title'),
              note: $t('overview.registered.note'),
              content: overviewUser.numRegistedDay || 0,
              symbol: $t('overview.day'),
              type: 'main',
            }"
          />
          <dashboard-transaction-card
            :overview="{
              title: $t('overview.total_trans.title'),
              note: $t('overview.total_trans.note'),
              content: `${fiatSymbol} ${
                formatValue(overviewUser?.amountTransaction || 0, 0)}`,
              type: 'main',
            }"
          />
        </div>
      </div>
      <div class="dashboard-user-transaction__content">
        <div class="dashboard-user-transaction__title">
          <img src="/assets/icons/30-days.svg" alt="30 days" />
          {{ $t("overview.transaction_in_month") }}
        </div>
        <div class="dashboard-user-transaction__grid">
          <dashboard-transaction-card
            :overview="{
              title: $t('overview.trans_month.title'),
              note: $t('overview.trans_month.note'),
              content:
              formatValue(
                  overviewUser?.totalTransaction30DayBuy,
                  overviewUser?.totalTransaction30DaySell
                ) || 0,
              symbol: $t('merchant.overview.times'),
              totalTransactionBuy: overviewUser?.totalTransaction30DayBuy || '0',
              totalTransactionSell:
                overviewUser?.totalTransaction30DaySell || '0',
              type: 'main',
            }"
          />
          <dashboard-transaction-card
            :overview="{
              title: $t('overview.completion_rate_month_user.title'),
              note: $t('overview.completion_rate_month_user.note'),
              content: overviewUser?.rate || 0,
              symbol: '%',
              type: 'main',
            }"
          />
          <dashboard-overview-card
            class="background-transparent"
            :overview-data="{
              title: $t('overview.total_trans.title'),
              note: $t('overview.total_trans.note'),
              value: `${fiatSymbol} ${formatValue(overviewUser?.amountTransaction30Day || 0, 0)}`
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dashboardMixin from '@/mixins/dashboard/index.js';

export default {
  components: {
    DashboardOverviewCard: () =>
      import(
        '~/components/desktop/dashboard/components/dashboard-overview-card.vue'
      ),
    DashboardTransactionCard: () =>
      import(
        '~/components/desktop/dashboard/components/dashboard-transaction-card.vue'
      ),
    DashboardCard: () =>
      import('~/components/desktop/dashboard/components/dashboard-card.vue'),
  },
  mixins: [dashboardMixin],
  props: {
    fiatSymbol: {
      type: String,
      default: '₫',
    },
    overviewUser: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-user-transaction {
  &__container {
    color: var(--mode-light-dark-1500);
    min-height: calc(100vh - 220px);
    width: 100%;
  }
  &__wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  &__content {
    padding: 16px;
    &:not(.dashboard-user-transaction__content--main) {
      background-color: var(--mode-light-dark-0);
      min-height: 55vh;
    }
  }
  &__grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
    padding: 16px;
    background-color: var(--mode-light-dark-100);
    border-radius: 6px;
    & > div,
    & > article {
      width: 100%;
    }
  }
  &__title {
    @include font-t14b;
    display: flex;
    align-items: flex-end;
    gap: 4px;
    margin-bottom: 4px;
    line-height: 1;
    img {
      width: 16px;
    }
  }
}
</style>
