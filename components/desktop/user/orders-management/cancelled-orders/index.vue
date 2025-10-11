<template>
  <div class="management-orders">
    <div class="management-orders__container">
      <div class="management-orders__note">
        {{ $t('merchant.detail_cancelled.count_appeal_order', { count: total }) }}
      </div>
      <div class="management-orders__head">
        <template v-if="isSkeletonLoading">
          <filter-loader-skeleton />
        </template>
        <template v-else>
          <filter-head-history
            :loading="orderLoading"
            :is-visible-date-picker="false"
            is-visible-search
            :is-visible-status="false"
            :visible-fields="[ORDER_FIELD_SEARCH_GROUP.REF_ID, ORDER_FIELD_SEARCH_GROUP.TOTAL_PRICE]"
            is-history
            @on-search="$commonOrderMixin_onSearch"
            @on-filters="$cancelledOrdersMixin_onFilterOrder"
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
          >
            <template #cell(type)="{ item }">
              <order-type
                is-horizontal
                :post-type="item.postType === POST_TYPE.BUY ? POST_TYPE.SELL : POST_TYPE.BUY"
                :name="item.assetName"
                :network="item.assetNetwork"
              />
              <div :id="`order_id_${item.orderId}`" class="order-no order-no--cursor-default">
                #{{ item.orderRefId }}
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
            <template #cell(status)="{ item }">
              <order-user-appeal-status
                :type="USER_TYPE.USER"
                :title-modified="`${$t('user_orders.status_cancel')}`"
                :order="item"
                :appeal="item.appeal"
              />
            </template>
          </order-table>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { POST_TYPE, USER_TYPE } from '@/config/constant'
import userBuyOrderMixin from '@/mixins/user-buy-order'
import cancelledOrdersMixin from '@/mixins/user/orders/cancelled'
import { ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders'

export default {
  components: {
    OrderUserAppealStatus: () => import('~/components/desktop/orders/table/items/order-appeal-status.vue'),
    OrderAmount: () => import('~/components/desktop/orders/table/items/order-amount.vue'),
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    FilterHeadHistory: () => import('~/components/desktop/orders/filter-head-table/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [userBuyOrderMixin, cancelledOrdersMixin],
  data () {
    return {
      POST_TYPE,
      USER_TYPE,
      ORDER_FIELD_SEARCH_GROUP
    }
  },
  created () {
    this.$cancelledOrdersMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 800)
    })
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user/orders-management/index.scss">
</style>
