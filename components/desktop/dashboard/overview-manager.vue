<template>
  <section>
    <section class="grid-overview">
      <div class="grid-overview__list">
        <div class="grid-overview__wrapper" :class="{'grid-overview__wrapper--three-column': isVisibleDashboardManager}">
          <div v-if="isVisibleDashboardManager" class="grid-overview__item revenue-chart price-chart">
            <p class="title">
              <span>{{ $t('price_statistic.title') }}</span>
            </p>
            <button class="view-btn" @click="$bvModal.show(modalComparePriceId)">{{ $t('common.view') }}</button>
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
  </section>
</template>
<script>
import dashboardMixin from '@/mixins/dashboard/index.js'
import { USER_ROLE } from '@/config/constant'
import { MODAL } from '~/resources/modal';

export default {
  components: {
    DashboardCard: () => import('~/components/desktop/dashboard/components/dashboard-card.vue')
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
      USER_ROLE,
      modalComparePriceId: MODAL.COMPARE_PRICE_STATISTIC
    };
  },
  computed: {
    isVisibleDashboardManager () {
      return this.user?.type === USER_ROLE.MERCHANT_MANAGER && this.$route.name === 'merchant-manager-dashboard'
    },
    userOverView () {
      return [
        {
          title: this.$t('overview.transaction_in_progress.title'),
          note: this.$t('overview.transaction_in_progress.note'),
          value: this.formatValue(this.overviewUser?.totalBuyOrderProcessing, this.overviewUser?.totalSellOrderProcessing) || 0,
          symbol: this.$t('merchant.overview.transaction'),
          icon: '/assets/icons/dashboard/inprogress-transaction.svg',
          buyAmount: this.overviewUser?.totalBuyOrderProcessing || '0',
          sellAmount: this.overviewUser?.totalSellOrderProcessing || '0'
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
        },
        {
          title: this.$t('overview.order_complained.title'),
          note: this.$t('overview.order_complained.note'),
          value: `${(this.overviewUser?.totalAppealedOrder || 0)}`,
          symbol: `${this.$t('overview.complain')}`
        }
      ]
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/dashboard/overview-admin.scss">
</style>
<style lang="scss" scoped>
.grid-overview {
  &__wrapper {
    grid-template-columns: 1fr 1fr;
    &--three-column {
      grid-template-columns: calc(clamp(200px, 32%, 295px)) 1fr 1fr;
    }
  }
}
</style>
