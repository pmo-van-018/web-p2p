<template>
  <div class="overview-context">
    <section class="grid-overview">
      <div class="grid-overview__list">
        <div class="grid-overview__wrapper">
          <div class="grid-overview__item">
            <dashboard-card
              class="grid-overview__large-card"
              :overview-data="userOverView"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
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
  },
  computed: {
    userOverView () {
      return {
        title: this.$t('overview.ad_all.title'),
        note: this.$t('overview.ad_all.note'),
        value: this.formatValue(this.overviewUser?.numPostsBuy, this.overviewUser?.numPostsSell) || 0,
        symbol: this.$t('overview.post'),
        icon: '/assets/icons/dashboard/post.svg',
        buyAmount: this.overviewUser?.numPostsBuy || 0,
        sellAmount: this.overviewUser?.numPostsSell || 0
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/dashboard/overview-admin.scss">
</style>
<style lang="scss" scoped>
.grid-overview {
  &__wrapper {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }
}
::v-deep {
  .overview-card__container {
    min-width: 250px;
    width: 32%;
  }
  .overview-card__inner:not(.overview-card__inner--bottom) {
    flex-direction: row-reverse;
    justify-content: flex-end !important;
    gap: 4px
  }
  .grid-overview__large-card {
    background: url('/assets/images/common/operation/operator-dashboard-card-banner.jpg') no-repeat right bottom;
    background-size: contain;
  }
}
</style>
