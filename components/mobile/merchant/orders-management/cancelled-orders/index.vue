<template>
  <order-grid-renderer class="management-order">
    <template #head>
      <filter-history-head
        :is-visible-calendar="false"
        @on-submit="onFilterOptions"
      />
    </template>
    <template #note>
      <detail-note
        :cancel-order-count="cancelOrderCount"
        :cancel-order-appeal-count="cancelOrderAppealCount"
      />
    </template>
    <template #body>
      <list-common
        :loading="orderLoading"
        :items="orders"
        :total="total"
        :reset-list="page === 1"
        show-empty
        @refresh="onRefresh"
        @infinite-loading="$commonOrdersMixin_onInfiniteLoadingOrder"
      >
        <template #default="{ item }">
          <div :key="item.orderId" class="management-order__item">
            <order-card
              is-cancelled
              is-hidden-bank-number
              :order="item"
              @on-open-detail="$commonOrdersMixin_onOpenDetailModal"
            />
          </div>
        </template>
      </list-common>
      <order-detail-modal :order-detail="orderDetail" />
    </template>
  </order-grid-renderer>
</template>
<script>
import { ORDER_STATUS } from '@/config/constant';
import { ORDER_GROUPS } from '@/resources/order-filters';
import cancelledOrdersMixin from '~/mixins/merchant/orders/cancelled'

export default {
  components: {
    OrderCard: () => import('~/components/mobile/merchant/orders-management/card-order/index.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    OrderDetailModal: () => import('~/components/mobile/modal/orders/detail/index.vue'),
    FilterHistoryHead: () => import('~/components/mobile/orders/filters/history-filter.vue'),
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue'),
    DetailNote: () => import('~/components/desktop/merchant/orders-management/cancelled-orders/detail-note.vue')
  },
  mixins: [cancelledOrdersMixin],
  data () {
    return {
      orderGroup: ORDER_GROUPS.CANCEL
    }
  },
  computed: {
    orders () {
      return this.listOrder.filter(item => ORDER_STATUS.CANCELLED === item.status)
    }
  },
  async created () {
    await this.$cancelledOrdersMixin_onResetFilter()
  },
  methods: {
    async onRefresh () {
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    },
    async onFilterOptions (options) {
      const { assetType, orderStatus, page, type, startDate, endDate } = options
      this.assetType = assetType
      this.orderStatus = orderStatus
      this.page = page
      this.type = type
      this.startDate = startDate
      this.endDate = endDate
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/orders-management/index.scss">
</style>
