<template>
  <div class="management-orders">
    <div class="management-orders__container">
      <div class="management-orders__head">
        <template v-if="isSkeletonLoading">
          <filter-loader-skeleton />
        </template>
        <template v-else>
          <filter-head-history
            :loading="orderLoading"
            is-visible-date-picker
            is-visible-search
            :visible-fields="ORDER_FIELD_SEARCH_DEFAULT"
            :is-visible-status="false"
            is-history
            @on-search="$commonOrderMixin_onSearch"
            @on-filters="$completedOrdersMixin_onFilterOrder"
            @on-refresh="$commonOrderMixin_onRefresh"
          />
        </template>
      </div>
      <div class="management-orders__body">
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
            :items="listOrder"
            :fields="fields"
            :page="page"
            :limit="limit"
            :total="total"
            :is-loading="orderLoading"
            @change-sort="$commonOrderMixin_handleChangeSort"
            @change-pagination="$commonOrderMixin_onChangePage"
            @row-clicked="onRowClicked"
          >
            <template #cell(type)="{ item }">
              <order-type
                is-horizontal
                :post-type="item.postType === POST_TYPE.BUY ? POST_TYPE.SELL : POST_TYPE.BUY"
                :name="item.assetName"
                :network="item.assetNetwork"
              />
              <div :id="`order_id_${item.orderId}`" class="order-no" @click="onShowOrderDetail(item)">
                #{{ item.orderRefId }}
              </div>
              <b-tooltip :target="`order_id_${item.orderId}`" triggers="hover">
                {{ $t('user_orders.see_detail') }}
              </b-tooltip>
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

            <template #cell(actions)="{ item }">
              <div class="view-more">
                <div class="view-more__action" @click="onShowOrderDetail(item)">{{ $t('user_orders.see_detail') }}</div>
              </div>
            </template>
          </order-table>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { ORDER_STATUS, POST_TYPE } from '@/config/constant'
import userBuyOrderMixin from '@/mixins/user-buy-order'
import completedOrdersMixin from '@/mixins/user/orders/completed'

export default {
  components: {
    OrderStatus: () => import('~/components/desktop/orders/table/items/order-status.vue'),
    OrderAmount: () => import('~/components/desktop/orders/table/items/order-amount.vue'),
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderTransCode: () => import('~/components/desktop/orders/table/items/order-trans-code.vue'),
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    FilterHeadHistory: () => import('~/components/desktop/orders/filter-head-table/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [userBuyOrderMixin, completedOrdersMixin],
  data () {
    return {
      POST_TYPE
    }
  },
  created () {
    this.$completedOrdersMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 800)
    })
  },
  methods: {
    ...mapActions('end-user', [
      'setBuyInfo'
    ]),
    onShowOrderDetail (order) {
      this.setBuyInfo(order)
      this.$_userBuyOrderMixin_fetchDataBuyInfo(true, 'history')
    },
    formatDateTime (order) {
      const dateTime = order.status === ORDER_STATUS.CANCELLED ? order.endedTime : order.completedTime
      return this.$options.filters.formatDateTime(dateTime)
    },
    goDetail (order) {
      this.setBuyInfo(order)
      this.$_userBuyOrderMixin_fetchDataBuyInfo(true, 'history')
    },
    onRowClicked (item) {
      this.onShowOrderDetail(item)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user/orders-management/index.scss">
</style>
