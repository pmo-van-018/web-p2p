<template>
  <order-grid-renderer class="management-orders">
    <template #head>
      <filter-history-head
        @on-submit="$completedOrdersMixin_onFilterOrder"
      />
    </template>
    <template #body>
      <list-common
        :loading="orderLoading"
        :items="orders"
        :total="total"
        :reset-list="page === 1"
        show-empty
        @refresh="$commonOrderMixin_onRefresh"
        @infinite-loading="$commonOrdersMixin_onInfiniteLoadingOrder"
      >
        <template #default="{ item }">
          <div
            :key="item.orderId"
            class="management-orders__item"
          >
            <order-card is-hidden-bank-number :order="item" :reverse-post-type="true" @on-open-detail="onOpenDetail" />
          </div>
        </template>
      </list-common>
    </template>
  </order-grid-renderer>
</template>
<script>
import userBuyOrderMixin from '@/mixins/user-buy-order'
import { ORDER_STATUS } from '@/config/constant';
import completedOrdersMixin from '~/mixins/user/orders/completed'

export default {
  components: {
    OrderCard: () => import('~/components/mobile/user/orders-management/card-order/index.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    FilterHistoryHead: () => import('~/components/mobile/orders/filters/history-filter.vue'),
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue')
  },
  mixins: [userBuyOrderMixin, completedOrdersMixin],
  computed: {
    orders () {
      return this.listOrder.filter(item => ORDER_STATUS.COMPLETED === item.status)
    }
  },
  async created () {
    await this.$completedOrdersMixin_onResetFilter()
  },
  methods: {
    onOpenDetail (order) {
      this.setBuyInfo(order)
      this.$_userBuyOrderMixin_fetchDataBuyInfo(true, 'history')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user/orders-management/index.scss">
</style>
