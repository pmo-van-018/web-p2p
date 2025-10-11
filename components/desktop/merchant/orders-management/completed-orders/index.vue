<template>
  <div class="completed-order">
    <div class="completed-order__container">
      <div class="completed-order__head">
        <template v-if="isSkeletonLoading">
          <filter-loader-skeleton class="delay-animation" />
        </template>
        <template v-else>
          <filter-head-history
            :loading="orderLoading"
            :is-visible-date-picker="false"
            is-history
            is-visible-search
            :visible-fields="ORDER_FIELD_SEARCH_DEFAULT"
            :is-visible-status="false"
            @on-search="$commonOrderMixin_onSearch"
            @on-filters="$completedOrdersMixin_onFilterOrder"
            @on-refresh="$completedOrdersMixin_onRefresh"
          />
        </template>
      </div>
      <div class="completed-order__table">
        <template v-if="isSkeletonLoading">
          <b-skeleton-table
            class="delay-animation"
            :rows="7"
            :columns="4"
            :table-props="{ bordered: false, striped: false }"
          />
        </template>
        <template v-else>
          <order-table
            :items="orders"
            :fields="fields"
            :page="page"
            :limit="limit"
            :total="total"
            :is-loading="orderLoading"
            @change-sort="$commonOrderMixin_handleChangeSort"
            @change-pagination="$commonOrderMixin_onChangePage"
          >
            <template #cell(type)="{ item }">
              <order-type
                is-horizontal
                :post-type="item.postType"
                :name="item.assetName"
                :network="item.assetNetwork"
              />
              <div class="description-text">
                <div
                  :id="`order_id_${item.orderId}`"
                  class="description-text__title description-text__title--underline"
                  @click="$commonOrderMixin_openDetails(item)"
                >
                  #{{ item.orderRefId }}
                </div>
                <b-tooltip :target="`order_id_${item.orderId}`" triggers="hover">
                  {{ $t('merchant.list_order.order_item.see_detail') }}
                </b-tooltip>
              </div>
            </template>
            <template #cell(amount)="{ item }">
              <order-amount
                :order-id="item.orderId"
                :post-type="item.postType"
                :fiat-symbol="item.fiatSymbol"
                :asset-name="item.assetName"
                :amount-crypto="item.amount"
                :total-price="item.totalPrice"
              />
            </template>
            <template #cell(content)="{ item }">
              <order-trans-code :order-id="item.orderId" :trans-code="item.transCode" />
            </template>
            <template #cell(completedTime)="{ item }">
              <div class="order-datetime">
                {{ formatDateTime(item) }}
              </div>
            </template>
            <template #cell(status)="{ item }">
              <order-status :order="item" />
            </template>
            <template #cell(term)="{ item }">
              <div v-if="item.isPaymentFromAnotherAccount" class="label-type">
                <div class="label-type__text">{{ $t('action.term_transfer') }}</div>
              </div>
            </template>

            <!-- Visible when click order no -->
            <template #row-details="{ item }">
              <detail-row-order :order="item" :joined-room="false" @close="$commonOrderMixin_closeDetail(item)" />
            </template>
          </order-table>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { ORDER_STATUS } from '@/config/constant'
import completedOrdersMixin from '~/mixins/merchant/orders/completed'

export default {
  components: {
    OrderStatus: () => import('~/components/desktop/orders/table/items/order-status.vue'),
    OrderAmount: () => import('~/components/desktop/orders/table/items/order-amount.vue'),
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderTransCode: () => import('~/components/desktop/orders/table/items/order-trans-code.vue'),
    DetailRowOrder: () => import('~/components/desktop/orders/table/detail-row-order/index.vue'),
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    FilterHeadHistory: () => import('~/components/desktop/orders/filter-head-table/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [completedOrdersMixin],
  computed: {
    orders () {
      return this.listOrder?.filter(item => ORDER_STATUS.COMPLETED === item.status)
        .map((item) => {
          return {
            ...item,
            _showDetails: false
          }
        })
    }
  },
  created () {
    this.$completedOrdersMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 600)
    })
  },
  methods: {
    formatDateTime (order) {
      const dateTime = order.status === ORDER_STATUS.CANCELLED ? order.endedTime : order.completedTime
      return this.$options.filters.formatDateTime(dateTime)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/completed-orders.scss">
</style>
