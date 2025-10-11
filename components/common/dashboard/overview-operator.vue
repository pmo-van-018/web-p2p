<template>
  <div class="overview__content">
    <client-only>
      <OverviewItem v-for="item in dataOverview" :key="item.id" :data="item" />
    </client-only>
  </div>
</template>
<script>
import OverviewItem from '@/components/common/dashboard/overview-item.vue'
import dashboardMixin from '@/mixins/dashboard/index.js'

export default {
  components: {
    OverviewItem
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
  computed: {
    dataOverview () {
      return [
        {
          id: 1,
          isSlot: true,
          title: this.$t('overview.trans_all.title'),
          note: this.$t('overview.trans_all.note'),
          content: this.plusTwoNumber(this.overviewUser?.totalTransactionBuy, this.overviewUser?.totalTransactionSell),
          totalTransactionBuy: this.overviewUser.totalTransactionBuy,
          totalTransactionSell: this.overviewUser.totalTransactionSell,
          unit: this.$t('merchant.overview.times')
        },
        {
          id: 2,
          isSlot: true,
          title: this.$t('overview.trans_in_month.title'),
          note: this.$t('overview.trans_in_month.note'),
          content: this.plusTwoNumber(this.overviewUser?.totalTransaction30DayBuy, this.overviewUser?.totalTransaction30DaySell),
          totalTransactionBuy: this.overviewUser.totalTransaction30DayBuy,
          totalTransactionSell: this.overviewUser.totalTransaction30DaySell,
          unit: this.$t('merchant.overview.times')
        },
        {
          id: 3,
          isSlot: true,
          title: this.$t('overview.ad_all.title'),
          note: this.$t('overview.ad_all.note'),
          content: this.plusTwoNumber(this.overviewUser?.numPostsBuy, this.overviewUser?.numPostsSell),
          totalTransactionBuy: this.overviewUser.numPostsBuy,
          totalTransactionSell: this.overviewUser.numPostsSell,
          unit: this.$t('overview.post')
        },
        {
          id: 4,
          isSlot: false,
          title: this.$t('overview.total_trans_month.title'),
          note: this.$t('overview.total_trans_month.note'),
          content: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.overviewUser?.amountTransaction30Day)}`,
          unit: ''
        },
        {
          id: 5,
          isSlot: false,
          title: this.$t('overview.total_trans_fee_month.title'),
          note: this.$t('overview.total_trans_fee_month.note'),
          content: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.overviewUser?.totalFee30Day)}`,
          unit: ''
        },
        {
          id: 6,
          isSlot: false,
          title: this.$t('overview.total_penalty_fee_month.title'),
          note: this.$t('overview.total_penalty_fee_month.note'),
          content: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.overviewUser?.totalPenaltyFee30Day)}`,
          unit: ''
        },
        {
          id: 7,
          isSlot: false,
          title: this.$t('overview.completion_rate_month.title'),
          note: this.$t('overview.completion_rate_month.note'),
          content: `${this.overviewUser?.rate} %`,
          unit: ''
        },
        {
          id: 8,
          isSlot: false,
          title: this.$t('overview.total_trans.title'),
          note: this.$t('overview.total_trans.note'),
          content: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.overviewUser?.amountTransaction)}`,
          unit: ''
        },
        {
          id: 9,
          isSlot: false,
          title: this.$t('overview.total_trans_fee.title'),
          note: this.$t('overview.total_trans_fee.note'),
          content: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.overviewUser?.totalFee)}`,
          unit: ''
        },
        {
          id: 10,
          isSlot: false,
          title: this.$t('overview.total_penalty_fee.title'),
          note: this.$t('overview.total_penalty_fee.note'),
          content: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.overviewUser?.totalPenaltyFee)}`,
          unit: ''
        }
      ]
    }
  }
};
</script>
