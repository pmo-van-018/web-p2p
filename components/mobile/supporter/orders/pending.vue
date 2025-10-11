<template>
  <order-grid-renderer class="management-order">
    <template #head>
      <order-filter-head @on-filters="$emit('on-filters', $event)" />
    </template>
    <template #body>
      <list-common
        :loading="isLoading"
        :items="orders"
        :total="total"
        show-empty
        :reset-list="page === 1"
        @refresh="$emit('on-refresh', $event)"
        @infinite-loading="$emit('infinite-loading', $event)"
      >
        <template #default="{ item }">
          <div :key="item.orderId" class="management-order__item supporter-view">
            <order-card
              :order="{ ...item, supporterView: true, readOnly: true, confirmResolved: false }"
              :is-visible-qr-bank-code="item.postType === POST_TYPE.BUY"
              :joined-room="false"
              @on-open-detail="openOrderDetail"
              @on-open-bank-qrcode="$emit('on-open-bank-qrcode', $event)"
              @supporter-pick-order="pickOrder"
            />
          </div>
        </template>
      </list-common>
      <modal-order-detail
        :order-detail="selectedOrder"
      />
    </template>
  </order-grid-renderer>
</template>
<script>
import supporterMixin from '@/mixins/merchant/supporter/orders';

export default {
  components: {
    OrderCard: () => import('~/components/mobile/merchant/orders-management/card-order/index.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    OrderFilterHead: () => import('~/components/mobile/orders/filters/order-filter.vue'),
    ModalOrderDetail: () => import('~/components/mobile/modal/orders/detail/index.vue'),
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue')
  },
  props: {
    orders: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  mixins: [supporterMixin]
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/orders-management/index.scss">
</style>
