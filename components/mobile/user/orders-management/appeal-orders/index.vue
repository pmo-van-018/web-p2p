<template>
  <order-grid-renderer class="management-orders">
    <template #head>
      <pending-filter-head @on-filters="$appealOrdersMixin_onFilterOrder" />
    </template>
    <template #body>
      <list-common
        class="management-orders__list"
        :loading="orderLoading"
        :items="orderMapped"
        :total="total"
        show-empty
        :reset-list="page === 1"
        @refresh="$commonOrderMixin_onRefresh"
        @infinite-loading="$commonOrdersMixin_onInfiniteLoadingOrder"
      >
        <template #default="{ item }">
          <div class="management-orders__wrapper-list">
            <div
              :key="item.orderId"
              class="management-orders__item"
            >
              <order-card :order="item" is-hidden-bank-number :reverse-post-type="true" @on-open-detail="onOpenDetail" />
            </div>
          </div>
        </template>
      </list-common>
    </template>
  </order-grid-renderer>
</template>
<script>
import userBuyOrderMixin from '@/mixins/user-buy-order'
import walletMixin from '~/mixins/open-wallet'
import modalMixin from '~/mixins/modal'
import appealOrdersMixin from '~/mixins/user/orders/appeal'

export default {
  components: {
    OrderCard: () => import('~/components/mobile/user/orders-management/card-order/index.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    PendingFilterHead: () => import('~/components/mobile/orders/filters/pending-filter.vue'),
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue')
  },
  mixins: [walletMixin, userBuyOrderMixin, modalMixin, appealOrdersMixin],
  async created () {
    await this.$appealOrdersMixin_onResetFilter()
  },
  methods: {
    onOpenDetail (order) {
      this.setBuyInfo(order)
      this.$_userBuyOrderMixin_fetchDataBuyInfo(true)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user/orders-management/index.scss">
</style>
