<template>
  <section class="dashboard-user-transaction">
    <div class="dashboard-user-transaction__container">
      <div class="dashboard-user-transaction__wrapper">
        <div class="dashboard-user-transaction__content dashboard-user-transaction__content--main">
          <dashboard-card
            :overview-data="{
              title: $t('overview.trans_all.title'),
              note: $t('overview.trans_all.note'),
              value:
                plusTwoNumber(
                  overviewUser?.totalTransactionBuy,
                  overviewUser?.totalTransactionSell
                ) || 0,
              symbol: $t('merchant.overview.times'),
              icon: '/assets/icons/dashboard/all-transaction.svg',
              buyAmount: overviewUser?.totalTransactionBuy || 0,
              sellAmount: overviewUser?.totalTransactionSell || 0,
            }"
          />
          <div class="dashboard-user-transaction__grid mt-4">
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
                content: `${fiatSymbol} ${$options.filters.formatMoney(overviewUser?.amountTransaction || 0)}`,
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
          <div class="dashboard-user-transaction__grid mt-4">
            <dashboard-transaction-card
              :overview="{
                title: $t('overview.trans_month.title'),
                note: $t('overview.trans_month.note'),
                content:
                  plusTwoNumber(
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
          </div>
          <dashboard-overview-card
            class="mt-4 background-transparent"
            :overview-data="{
              title: $t('overview.total_trans.title'),
              note: $t('overview.total_trans.note'),
              value: `${fiatSymbol} ${$options.filters.formatMoney(overviewUser?.amountTransaction30Day || 0)}`
            }"
          />
        </div>
      </div>
      <img
        class="dashboard-user-transaction__banner"
        :src="`/assets/images/components/desktop/end-user/dashboard-background${isDarkMode ? '-dark' : ''}.png`"
        alt="banner"
      />
    </div>
  </section>
</template>
<script>
import dashboardMixin from '@/mixins/dashboard/index.js';
import darkMModeMixin from '@/mixins/dark-mode.js';
import BigNumber from "bignumber.js";

export default {
  components: {
    DashboardOverviewCard: () =>
      import(
        "~/components/desktop/dashboard/components/dashboard-overview-card.vue"
      ),
    DashboardTransactionCard: () =>
      import(
        "~/components/desktop/dashboard/components/dashboard-transaction-card.vue"
      ),
    DashboardCard: () =>
      import("~/components/desktop/dashboard/components/dashboard-card.vue"),
  },
  mixins: [dashboardMixin, darkMModeMixin],
  props: {
    fiatSymbol: {
      type: String,
      default: "₫",
    },
    overviewUser: {
      type: Object,
      default: null,
    },
  },
  methods: {
    plusTwoNumber(number1, number2) {
      const total = new BigNumber(number1).plus(number2).toNumber();
      return total ? this.$options.filters.formatMoney(total) : 0;
    },
  },
};
</script>
<style
  lang="scss"
  scoped
  src="static/assets/scss/components/desktop/dashboard/components/dashboard-user-transaction.scss"
></style>
