<template>
  <section>
    <section class="grid-overview">
      <div class="grid-overview__list">
        <div class="grid-overview__wrapper">
          <div class="grid-overview__item revenue-chart">
            <p class="title">
              <span>{{ $t('admin.revenue_chart.statistic') }}</span>
              <span>{{ $t('admin.revenue_chart.revenue_price') }}</span>
            </p>
            <button class="view-btn" @click="$bvModal.show('modalRevenueChart')">{{ $t('admin.revenue_chart.view') }}</button>
          </div>
          <div v-for="item in userOverView" :key="item.title" class="grid-overview__item">
            <dashboard-card
              class="grid-overview__large-card"
              :overview-data="item"
            />
          </div>
        </div>
      </div>
    </section>
    <modal-chart-revenue />
  </section>
</template>
<script>
import dashboardMixin from '@/mixins/dashboard/index.js'
import { USER_ROLE } from '@/config/constant'

export default {
  components: {
    DashboardCard: () => import('~/components/desktop/dashboard/components/dashboard-card.vue'),
    ModalChartRevenue: () => import('~/components/desktop/modal/modal-chart-revenue.vue')
  },
  mixins: [dashboardMixin],
  props: {
    fiatSymbol: {
      type: String,
      default: '₫'
    },
    overviewUser: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      USER_ROLE
    };
  },
  computed: {
    userOverView () {
      return [
        {
          title: this.$t('overview.transaction_in_progress.title'),
          note: this.$t('overview.transaction_in_progress.note'),
          value: this.formatValue(this.overviewUser?.totalBuyOrderProcessing, this.overviewUser?.totalSellOrderProcessing) || 0,
          symbol: this.$t('merchant.overview.transaction'),
          icon: '/assets/icons/dashboard/inprogress-transaction.svg',
          buyAmount: this.overviewUser?.totalBuyOrderProcessing || 0,
          sellAmount: this.overviewUser?.totalSellOrderProcessing || 0
        },
        {
          title: this.$t('overview.ad_all.title'),
          note: this.$t('overview.ad_all.note'),
          value: this.formatValue(this.overviewUser?.numPostsBuy, this.overviewUser?.numPostsSell) || 0,
          symbol: this.$t('overview.post'),
          icon: '/assets/icons/dashboard/post.svg',
          buyAmount: this.overviewUser?.numPostsBuy || 0,
          sellAmount: this.overviewUser?.numPostsSell || 0
        }
      ]
    },
    dataOverview () {
      return [
        {
          title: this.$t('overview.trans_all.title'),
          note: this.$t('overview.trans_all.note'),
          value: this.formatValue(this.overviewUser?.totalTransactionBuy, this.overviewUser?.totalTransactionSell),
          symbol: this.$t('merchant.overview.times')
        },
        {
          title: this.$t('overview.total_trans_user.title'),
          note: this.$t('overview.total_trans_user.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewUser?.amountTransaction || 0, 0)}`
        },
        {
          title: this.$t('overview.total_trans_fee.title'),
          note: this.$t('overview.total_trans_fee.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewUser?.totalFee || 0, 0)}`
        },
        {
          title: this.$t('overview.total_penalty_fee.title'),
          note: this.$t('overview.total_penalty_fee.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewUser?.totalPenaltyFee || 0, 0)}`
        }
      ]
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/dashboard/overview-admin.scss">
</style>
