<template>
  <section>
    <div class="container">
      <div class="grid-overview">
        <div class="grid-overview__item grid-overview__item--spanning-column-item">
          <dashboard-card class="grid-overview__large-card" :title="$t('overview.trans_all.title')" :tooltip="$t('overview.trans_all.note')">
            <template #content>
              <span>
                <span class="font-t24m">
                  {{ plusTwoNumber(overviewUser?.totalTransactionBuy, overviewUser?.totalTransactionSell) }}
                </span>
                <span class="font-t20r ml-1">{{ $t('merchant.overview.times') }}</span>
              </span>
            </template>
            <template #footer>
              <div>
                <span class="font-t14r buy-color">{{ $t('common.buy') }} {{ overviewUser?.totalTransactionBuy || 0 }}</span>
                <span class="mx-1">|</span>
                <span class="font-t14r sell-color">{{ $t('common.sell') }} {{ overviewUser?.totalTransactionSell || 0 }}</span>
              </div>
            </template>
          </dashboard-card>
        </div>
        <div class="grid-overview__item">
          <dashboard-card
            class="grid-overview__large-card"
            :tooltip="$t('overview.registered.note')"
            :title="$t('overview.registered.title')"
          >
            <template #content>
              <span>
                <span class="font-t24m">
                  {{ overviewUser?.numRegistedDay || 0 }}
                </span>
                <span class="font-t20r ml-1">{{ $t('overview.day') }}</span>
              </span>
            </template>
          </dashboard-card>
        </div>
        <div class="grid-overview__item">
          <dashboard-card
            class="grid-overview__large-card"
            :tooltip="$t('overview.total_trans.note')"
            :title="$t('overview.total_trans.title')"
          >
            <template #content>
              {{ fiatSymbol }} {{ (overviewUser?.amountTransaction || 0) | formatMoney }}
            </template>
          </dashboard-card>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import dashboardMixin from '@/mixins/dashboard/index.js'

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
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/dashboard/overview-user.scss">
</style>
