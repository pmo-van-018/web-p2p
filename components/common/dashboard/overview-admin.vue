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
import { USER_ROLE } from '@/config/constant'

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
  data () {
    return {
      USER_ROLE
    };
  },
  computed: {
    dataOverview () {
      const commomDashboard = [
        {
          id: 1,
          isSlot: true,
          title: this.$t('overview.trans_all.title'),
          note: this.$t('overview.trans_all.note'),
          content: this.formatValue(this.overviewUser?.totalTransactionBuy, this.overviewUser?.totalTransactionSell),
          totalTransactionBuy: this.overviewUser.totalTransactionBuy,
          totalTransactionSell: this.overviewUser.totalTransactionSell,
          unit: this.$t('merchant.overview.times')
        },
        {
          id: 2,
          isSlot: true,
          title: this.$t('overview.trans_in_month.title'),
          note: this.$t('overview.trans_in_month.note'),
          content: this.formatValue(this.overviewUser?.totalTransaction30DayBuy, this.overviewUser?.totalTransaction30DaySell),
          totalTransactionBuy: this.overviewUser.totalTransaction30DayBuy,
          totalTransactionSell: this.overviewUser.totalTransaction30DaySell,
          unit: this.$t('merchant.overview.times')
        },
        {
          id: 3,
          isSlot: true,
          isPost: true,
          title: this.$t('overview.ad_all.title'),
          note: this.$t('overview.ad_all.note'),
          content: this.formatValue(this.overviewUser?.numPostsBuy, this.overviewUser?.numPostsSell),
          totalTransactionBuy: this.overviewUser.numPostsBuy,
          totalTransactionSell: this.overviewUser.numPostsSell,
          unit: this.$t('overview.post')
        },
        {
          id: 4,
          isSlot: false,
          title: this.$t('overview.total_trans_month.title'),
          note: this.$t('overview.total_trans_month.note'),
          content: `${this.fiatSymbol} ${this.formatValue(this.overviewUser?.amountTransaction30Day, 0)}`,
          unit: ''
        },
        {
          id: 5,
          isSlot: false,
          title: this.$t('overview.total_trans_fee_month.title'),
          note: this.$t('overview.total_trans_fee_month.note'),
          content: `${this.fiatSymbol} ${this.formatValue(this.overviewUser?.totalFee30Day, 0)}`,
          unit: ''
        },
        {
          id: 6,
          isSlot: false,
          title: this.$t('overview.total_penalty_fee_month.title'),
          note: this.$t('overview.total_penalty_fee_month.note'),
          content: `${this.fiatSymbol} ${this.formatValue(this.overviewUser?.totalPenaltyFee30Day, 0)}`,
          unit: ''
        },
        {
          id: 7,
          isSlot: false,
          title: this.$t('overview.total_trans.title'),
          note: this.$t('overview.total_trans.note'),
          content: `${this.fiatSymbol} ${this.formatValue(this.overviewUser?.amountTransaction, 0)}`,
          unit: ''
        },
        {
          id: 8,
          isSlot: false,
          title: this.$t('overview.total_trans_fee.title'),
          note: this.$t('overview.total_trans_fee.note'),
          content: `${this.fiatSymbol} ${this.formatValue(this.overviewUser?.totalFee, 0)}`,
          unit: ''
        },
        {
          id: 9,
          isSlot: false,
          title: this.$t('overview.total_penalty_fee.title'),
          note: this.$t('overview.total_penalty_fee.note'),
          content: `${this.fiatSymbol} ${this.formatValue(this.overviewUser?.totalPenaltyFee, 0)}`,
          unit: ''
        },
        {
          id: 10,
          isSlot: true,
          isInactive: true,
          title: this.$t('overview.total_merchants.title'),
          note: this.$t('overview.total_merchants.note'),
          content: `${this.overviewUser?.numMerchantActive}`,
          numMerchantInactive: this.overviewUser?.numMerchantInactive,
          unit: this.$t('overview.person')
        },
        {
          id: 11,
          isSlot: true,
          isInactive: true,
          title: this.$t('overview.total_number_trader.title'),
          note: this.$t('overview.total_number_trader.note'),
          content: `${this.overviewUser?.numStaffActive}`,
          numMerchantInactive: this.overviewUser?.numStaffInactive,
          unit: this.$t('overview.person')
        },
        {
          id: 12,
          isSlot: true,
          isInactive: false,
          title: this.$t('overview.total_users.title'),
          note: this.$t('overview.total_users.note'),
          content: `${this.overviewUser?.numUserActive}`,
          numMerchantInactive: this.overviewUser?.numUserInactive,
          unit: this.$t('overview.person')
        }
      ]
      return commomDashboard
    }
  }
};
</script>
