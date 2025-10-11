<template>
  <div class="completed-order">
    <div class="completed-order__container">
      <div class="completed-order__note">
        <detail-note
          :cancel-order-count="cancelOrderCount"
          :cancel-order-appeal-count="cancelOrderAppealCount"
        />
      </div>
      <div class="completed-order__head">
        <template v-if="isSkeletonLoading">
          <filter-loader-skeleton class="delay-animation" />
        </template>
        <template v-else>
          <filter-head-history
            :loading="orderLoading"
            is-history
            is-visible-search
            :is-visible-status="false"
            :visible-fields="[ORDER_FIELD_SEARCH_GROUP.REF_ID, ORDER_FIELD_SEARCH_GROUP.TOTAL_PRICE]"
            @on-search="$commonOrderMixin_onSearch"
            @on-filters="$cancelledOrdersMixin_onFilterOrder"
            @on-refresh="$cancelledOrdersMixin_onRefresh"
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
              <div class="order-no order-no--cursor-default">
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

            <template #cell(penaltyFee)="{ item }">
              <order-penalty-fee :order="item" />
            </template>
            <template #cell(term)="{ item }">
              <div v-if="item.isPaymentFromAnotherAccount" class="label-type">
                <div class="label-type__text">{{ $t('action.term_transfer') }}</div>
              </div>
            </template>

            <template #cell(status)="{ item }">
              <order-merchant-appeal-status
                :type="USER_TYPE.MERCHANT"
                :title-modified="`${$t('merchant.list_order.status_cancel')}`"
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
import { ORDER_STATUS, USER_TYPE } from '@/config/constant'
import { ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders'
import cancelledOrdersMixin from '~/mixins/merchant/orders/cancelled'

export default {
  components: {
    OrderMerchantAppealStatus: () => import('~/components/desktop/orders/table/items/order-appeal-status.vue'),
    OrderAmount: () => import('~/components/desktop/orders/table/items/order-amount.vue'),
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderPenaltyFee: () => import('~/components/desktop/orders/table/items/order-penalty-fee.vue'),
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    FilterHeadHistory: () => import('~/components/desktop/orders/filter-head-table/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    DetailNote: () => import('~/components/desktop/merchant/orders-management/cancelled-orders/detail-note.vue')
  },
  mixins: [cancelledOrdersMixin],
  data () {
    return {
      USER_TYPE,
      ORDER_FIELD_SEARCH_GROUP
    }
  },
  computed: {
    orders () {
      return this.listOrder?.filter(item => ORDER_STATUS.CANCELLED === item.status)
        .map((item) => {
          return {
            ...item,
            _showDetails: false
          }
        })
    }
  },
  created () {
    this.$cancelledOrdersMixin_onResetFilter().then(() => {
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
