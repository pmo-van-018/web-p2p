<template>
  <div class="w-100">
    <div class="overview grey-400 w-100 px-4">
      <div :class="{ 'container': userRole === USER_ROLE.USER }">
        <OverviewTitle
          :is-show-button="isShowExportButton && !showBackButton || !!reporterInfo"
          :is-end-user="userRole === USER_ROLE.USER"
          :is-show-title="isShowTitle"
          :is-mobile="isMobileOrTablet"
          back-button
          :is-refresh-button="!showBackButton"
          :is-loading="isLoadingOverview"
          :staff-name="nickName"
          :staff-wallet="walletAddress"
          @click="onOpenSummaryReport"
          @on-refresh="refreshStatisticData"
        />
      </div>
    </div>
    <client-only>
      <template v-if="userRole === USER_ROLE.USER">
        <div v-if="isLoadingRefreshData" class="overview__loading">
          <loader />
          <p class="overview__loading-indicator">{{ $t('merchant.overview.loading') }}</p>
        </div>
        <div v-else class="container">
          <dashboard-user-transaction :overview-user="overviewData" />
        </div>
      </template>
      <template v-else>
        <div v-if="isLoadingRefreshData" class="overview__loading">
          <loader />
          <p class="overview__loading-indicator">{{ $t('merchant.overview.loading') }}</p>
        </div>
        <div v-else class="overview__wrapper row">
          <div class="overview__content--left col-xxl-9" :class="isVisibleTradingPeriodChart ? 'col-lg-12' : 'col-lg-7 col-xl-8'">
            <component :is="component" :overview-user="overviewData" />
            <div class="overview grey-400 w-100 mw-100 wrap-chart bg-white">
              <div class="wrap-chart__left">
                <ChartBar :is-show-button="isShowExportButton && !showBackButton || !!reporterInfo" />
              </div>
              <div v-if="isVisibleTradingPeriodChart" class="wrap-chart__right">
                <trading-period-chart
                  :loading="isLoadingTradingPeriodItems"
                  :items="tradingPeriodItems"
                  @input="onChangeDateTradingPeriod(user?.id, $event)"
                />
              </div>
            </div>
          </div>
          <div class="overview__content--right col-xxl-3 p-0" :class="isVisibleTradingPeriodChart ? 'col-lg-12' : 'col-lg-5 col-xl-4'">
            <dashboard-transaction
              :id-item="randomId()"
              :overview-data="dataOverview30DaysWithRoles"
            />
          </div>
        </div>
        <div v-if="!isLoadingRefreshData" class="overview__wrapper row">
          <div :class="`overview__content--left ${isOperation ? 'col-12' : 'col-xxl-9 col-lg-7'}`">
            <div class="overview__bottom">
              <div class="overview__bottom-title">
                <img src="/assets/icons/dashboard/total-transaction.svg" alt="total-transaction">
                {{ $t('overview.bottom.title') }}
              </div>
              <div class="overview__bottom-sub-title">
                {{ $t('overview.bottom.sub_title') }}
              </div>
              <div class="overview__bottom-wrapper">
                <dashboard-overview-card
                  v-for="item in dataOverviewTransactionWithRoles"
                  :key="item.title"
                  :overview-data="item"
                />
              </div>
            </div>
          </div>
          <div v-if="!isOperation" class="overview__wrapper--right col-xxl-3 col-lg-5">
            <dashboard-user :overview-user="overviewUserDataWithRoles" :role="isAdmin ? 'admin' : 'manager'" />
          </div>
        </div>
      </template>
    </client-only>
    <client-only>
      <modal-summary-report />
      <modal-compare-price />
      <modal-no-data />
    </client-only>
  </div>
</template>
<script>
import { USER_ROLE } from '@/config/constant.js';
import OverviewTitle from '@/components/desktop/dashboard/overview-title.vue'
import OverviewUser from '@/components/desktop/dashboard/overview-user.vue'
import OverviewOperator from '@/components/desktop/dashboard/overview-operator.vue'
import OverviewManager from '@/components/desktop/dashboard/overview-manager.vue'
import OverviewAdmin from '@/components/desktop/dashboard/overview-admin.vue'
import dashboardMixin from '@/mixins/dashboard/index.js'
import { mapState } from 'vuex';
import { MODAL } from '@/resources/modal'
import dayjs from 'dayjs';

export default {
  components: {
    OverviewTitle,
    OverviewUser,
    OverviewOperator,
    OverviewManager,
    OverviewAdmin,
    DashboardOverviewCard: () => import('~/components/desktop/dashboard/components/dashboard-overview-card.vue'),
    DashboardUser: () => import('~/components/desktop/dashboard/components/dashboard-user.vue'),
    ChartBar: () => import('~/components/common/line-area-chart'),
    DashboardSkeleton: () => import('~/components/desktop/dashboard/components/dashboard-skeleton.vue'),
    DashboardCard: () => import('~/components/desktop/dashboard/components/dashboard-card.vue'),
    DashboardTransaction: () => import('~/components/desktop/dashboard/components/dashboard-transaction.vue'),
    DashboardUserTransaction: () => import('~/components/desktop/dashboard/components/dashboard-user-transaction.vue'),
    ModalSummaryReport: () => import('~/components/desktop/modal/modal-summary-report.vue'),
    ModalComparePrice: () => import('~/components/desktop/modal/modal-compare-price.vue'),
    ModalNoData: () => import('~/components/desktop/modal/modal-no-data.vue'),
    TradingPeriodChart: () => import('~/components/desktop/dashboard/components/trading-period/index.vue'),
    Loader: () => import('~/components/common/loader.vue')
  },
  mixins: [dashboardMixin],
  props: {
    overviewRender: {
      type: String,
      default: ''
    },
    visibleNickName: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      USER_ROLE,
      isMobileOrTablet: this.$device.isMobileOrTablet,
      fiatSymbol: '₫'
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState({
      reporterInfo: state => state.reporter.user
    }),
    isOperation () {
      return this.user?.type === this.USER_ROLE.MERCHANT_OPERATOR
    },
    isAdmin () {
      return this.user?.type === this.USER_ROLE.SUPER_ADMIN
    },
    component () {
      switch (this.overviewRender) {
        case this.USER_ROLE.SUPER_ADMIN:
          return OverviewAdmin;
        case this.USER_ROLE.MERCHANT_MANAGER:
          return OverviewManager;
        case this.USER_ROLE.MERCHANT_OPERATOR:
          return OverviewOperator;
        default:
          return OverviewUser
      }
    },
    overviewUserDataWithRoles () {
      switch (this.overviewRender) {
        case this.USER_ROLE.SUPER_ADMIN:
          return [
            {
              id: this.randomId(),
              title: this.$t('overview.total_users.title'),
              note: this.$t('overview.total_users.note'),
              value: this.overviewData?.numUserActive,
              symbol: this.$t('overview.person')
            },
            {
              id: this.randomId(),
              title: this.$t('overview.total_merchants.title'),
              note: this.$t('overview.total_merchants.note'),
              value: this.overviewData?.numMerchantActive,
              symbol: this.$t('overview.person'),
              subContent: {
                title: this.$t('overview.block'),
                value: this.overviewData?.numMerchantInactive
              }
            },
            {
              id: this.randomId(),
              title: this.$t('overview.total_number_trader.title'),
              note: this.$t('overview.total_number_trader.note'),
              value: this.overviewData?.numStaffActive,
              symbol: this.$t('overview.person'),
              subContent: {
                title: this.$t('overview.block'),
                value: this.overviewData?.numStaffInactive
              }
            }
          ]
        case this.USER_ROLE.MERCHANT_MANAGER:
          return [
            {
              id: this.randomId(),
              title: this.$t('overview.total_number_trader.title'),
              note: this.$t('overview.total_number_trader.note'),
              value: this.overviewData?.numStaffActive,
              symbol: this.$t('overview.person'),
              subContent: {
                title: this.$t('overview.block'),
                value: this.overviewData?.numStaffInactive
              }
            }
          ]
        default:
          return []
      }
    },
    showBackButton () {
      return this.user?.type !== this.overviewRender;
    },
    isShowTitle () {
      return this.overviewRender === this.user?.type || this.overviewRender === this.USER_ROLE.MERCHANT_OPERATOR
    },
    isVisibleTradingPeriodChart () {
      return (this.isAdmin || this.reporterInfo) && this.$route.name === 'dashboard'
    },
    dataOverview30DaysWithRoles () {
      switch (this.overviewRender) {
        case this.USER_ROLE.SUPER_ADMIN:
        case this.USER_ROLE.ADMIN_SUPPORTER:
          return this.dataOverviewAdmin30Days;
        case this.USER_ROLE.MERCHANT_MANAGER:
          return this.dataOverviewManager30Days;
        case this.USER_ROLE.MERCHANT_OPERATOR:
          return this.dataOverviewOperation30Days;
        default:
          return []
      }
    },
    dataOverviewAdmin30Days () {
      return [
        {
          id: this.randomId(),
          title: this.$t('overview.trans_month_all.title'),
          note: this.$t('overview.trans_month_all.note'),
          content: this.formatValue(this.overviewData?.totalTransaction30Day),
          totalTransactionBuy: this.overviewData.totalTransaction30DayBuy,
          totalTransactionSell: this.overviewData.totalTransaction30DaySell,
          symbol: this.$t('merchant.overview.times'),
          type: 'main'
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.total_trans.title'),
          note: this.$t('overview.month.total_trans.note'),
          content: `₫ ${this.formatValue(this.overviewData?.amountTransaction30Day)}`
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.completion_rate.title'),
          note: this.$t('overview.month.completion_rate.note'),
          content: `${this.overviewData?.rate}%`
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.total_trans_fee.title'),
          note: this.$t('overview.month.total_trans_fee.note'),
          content: `₫ ${this.formatValue(this.overviewData?.totalFee30Day)}`
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.total_penalty_fee.title'),
          note: this.$t('overview.month.total_penalty_fee.note'),
          content: `₫ ${this.formatValue(this.overviewData?.totalPenaltyFee30Day)}`
        }
      ]
    },
    dataOverviewManager30Days () {
      return [
        {
          id: this.randomId(),
          title: this.$t('overview.trans_month_all.title'),
          note: this.$t('overview.trans_month_all.note'),
          content: this.formatValue(this.overviewData?.totalTransaction30Day),
          totalTransactionBuy: this.overviewData.totalTransaction30DayBuy,
          totalTransactionSell: this.overviewData.totalTransaction30DaySell,
          symbol: this.$t('merchant.overview.times'),
          type: 'main'
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.total_trans.title'),
          note: this.$t('overview.month.total_trans.note'),
          content: `₫ ${this.formatValue(this.overviewData?.amountTransaction30Day)}`
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.completion_rate.title'),
          note: this.$t('overview.month.completion_rate.note'),
          content: `${this.overviewData?.rate}%`
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.total_trans_fee.title'),
          note: this.$t('overview.month.total_trans_fee.note'),
          content: `₫ ${this.formatValue(this.overviewData?.totalFee30Day)}`
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.total_penalty_fee.title'),
          note: this.$t('overview.month.total_penalty_fee.note'),
          content: `₫ ${this.formatValue(this.overviewData?.totalPenaltyFee30Day)}`
        }
      ]
    },
    dataOverviewOperation30Days () {
      return [
        {
          id: this.randomId(),
          title: this.$t('overview.trans_month_all.title'),
          note: this.$t('overview.trans_month_all.note'),
          content: this.formatValue(this.overviewData?.totalTransaction30Day),
          symbol: this.$t('merchant.overview.times'),
          totalTransactionBuy: this.overviewData.totalTransaction30DayBuy,
          totalTransactionSell: this.overviewData.totalTransaction30DaySell,
          type: 'main'
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.total_trans.title'),
          note: this.$t('overview.total_trans.note'),
          content: `₫ ${this.formatValue(this.overviewData?.amountTransaction30Day)}`
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.completion_rate.title'),
          note: this.$t('overview.month.completion_rate.note'),
          content: `${this.overviewData?.rate}%`
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.total_trans_fee.title'),
          note: this.$t('overview.month.total_trans_fee.note'),
          content: `₫ ${this.formatValue(this.overviewData?.totalFee30Day)}`
        },
        {
          id: this.randomId(),
          title: this.$t('overview.month.total_penalty_fee.title'),
          note: this.$t('overview.month.total_penalty_fee.note'),
          content: `₫ ${this.formatValue(this.overviewData?.totalPenaltyFee30Day)}`
        }
      ]
    },
    // Transaction
    dataOverviewTransactionWithRoles () {
      switch (this.overviewRender) {
        case this.USER_ROLE.SUPER_ADMIN:
        case this.USER_ROLE.ADMIN_SUPPORTER:
          return this.dataOverviewAdminTransaction;
        case this.USER_ROLE.MERCHANT_MANAGER:
          return this.dataOverviewManagerTransaction;
        case this.USER_ROLE.MERCHANT_OPERATOR:
          return this.dataOverviewOperatorTransaction;
        default:
          return []
      }
    },
    dataOverviewAdminTransaction () {
      return [
        {
          title: this.$t('overview.trans_all.title'),
          note: this.$t('overview.trans_all.note'),
          value: this.formatValue(this.overviewData?.totalTransactionBuy, this.overviewData?.totalTransactionSell),
          symbol: this.$t('merchant.overview.times'),
          totalTransactionBuy: this.overviewData.totalTransactionBuy,
          totalTransactionSell: this.overviewData.totalTransactionSell,
          class: 'grey-card large-card'
        },
        {
          title: this.$t('overview.total_trans_user.title'),
          note: this.$t('overview.total_trans_user.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewData?.amountTransaction)}`
        },
        {
          title: this.$t('overview.total_trans_fee.title'),
          note: this.$t('overview.total_trans_fee.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewData?.totalFee)}`
        },
        {
          title: this.$t('overview.total_penalty_fee.title'),
          note: this.$t('overview.total_penalty_fee.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewData?.totalPenaltyFee)}`
        }
      ]
    },
    dataOverviewManagerTransaction () {
      return [
        {
          title: this.$t('overview.trans_all.title'),
          note: this.$t('overview.trans_all.note'),
          value: this.formatValue(this.overviewData?.totalTransactionBuy, this.overviewData?.totalTransactionSell),
          symbol: this.$t('merchant.overview.times'),
          totalTransactionBuy: this.overviewData.totalTransactionBuy,
          class: 'grey-card large-card',
          totalTransactionSell: this.overviewData.totalTransactionSell
        },
        {
          title: this.$t('overview.total_trans_user.title'),
          note: this.$t('overview.total_trans_user.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewData?.amountTransaction)}`
        },
        {
          title: this.$t('overview.total_trans_fee.title'),
          note: this.$t('overview.total_trans_fee.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewData?.totalFee)}`
        },
        {
          title: this.$t('overview.total_penalty_fee.title'),
          note: this.$t('overview.total_penalty_fee.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewData?.totalPenaltyFee)}`
        },
        {
          title: this.$t('overview.order_complained.title'),
          note: this.$t('overview.order_complained.note'),
          value: `${this.formatValue(this.overviewData?.totalAppealedOrder)} ${this.$t('merchant.overview.times')}`
        }
      ]
    },
    dataOverviewOperatorTransaction () {
      return [
        {
          title: this.$t('overview.trans_all.title'),
          note: this.$t('overview.trans_all.note'),
          value: this.formatValue(this.overviewData?.totalTransactionBuy, this.overviewData?.totalTransactionSell),
          symbol: this.$t('merchant.overview.times'),
          totalTransactionBuy: this.overviewData.totalTransactionBuy,
          class: 'grey-card',
          totalTransactionSell: this.overviewData.totalTransactionSell
        },
        {
          title: this.$t('overview.total_trans_user.title'),
          note: this.$t('overview.total_trans_user.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewData?.amountTransaction)}`
        },
        {
          title: this.$t('overview.total_trans_fee.title'),
          note: this.$t('overview.total_trans_fee.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewData?.totalFee)}`
        },
        {
          title: this.$t('overview.total_penalty_fee.title'),
          note: this.$t('overview.total_penalty_fee.note'),
          value: `${this.fiatSymbol} ${this.formatValue(this.overviewData?.totalPenaltyFee)}`
        }
      ]
    }
  },
  created () {
    this.getDataDashboard(this.user?.type === this.USER_ROLE.USER)
    if (this.isVisibleTradingPeriodChart) {
      const yesterday = dayjs().subtract(1, 'day').format()
      this.getTradingByPeriod(this.user?.id, yesterday)
    }
  },
  methods: {
    onOpenSummaryReport () {
      this.$bvModal.show(MODAL.SUMMARY_REPORT)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/dashboard/index.scss" />
