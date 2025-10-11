<template>
  <section class="management-orders">
    <div class="management-orders__container">
      <div class="management-orders__head">
        <template v-if="isSkeletonLoading">
          <filter-loader-skeleton class="delay-animation" />
        </template>
        <template v-else>
          <filter-head-table
            :loading="orderLoading"
            is-visible-search
            :visible-fields="ORDER_FIELD_SEARCH_DEFAULT"
            @on-search="$commonOrderMixin_onSearch"
            @on-filters="$pendingOrdersMixin_onFilterOrder"
            @on-refresh="$pendingOrdersMixin_onRefresh"
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
            :items="orderMapped"
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
                :post-type="item.postType === POST_TYPE.BUY ? POST_TYPE.SELL : POST_TYPE.BUY"
                :name="item.assetName"
                :network="item.assetNetwork"
              />
            </template>
            <template #cell(id)="{ item }">
              <div class="description-text">
                <div
                  class="description-text__title description-text__title--underline"
                >
                  #{{ item.orderRefId }}
                </div>
                <div class="description-text__title">
                  <order-status :order="item" />
                </div>
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

            <template #cell(progressing)="{ item }">
              <order-progressing :order="item" />
            </template>

            <template #cell(content)="{ item }">
              <order-trans-code :order-id="item.orderId" :trans-code="item.transCode" />
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
  </section>
</template>

<script>
import userBuyOrderMixin from '@/mixins/user-buy-order'
import { mapActions } from 'vuex'
import { POST_TYPE } from '@/config/constant.js'
import pendingOrdersMixin from '~/mixins/user/orders/pending'

export default {
  components: {
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderAmount: () => import('~/components/desktop/orders/table/items/order-amount.vue'),
    OrderTransCode: () => import('~/components/desktop/orders/table/items/order-trans-code.vue'),
    OrderStatus: () => import('~/components/desktop/orders/status/index.vue'),
    OrderProgressing: () => import('~/components/desktop/user/orders-management/pending-orders/order-progressing.vue'),
    FilterHeadTable: () => import('~/components/desktop/orders/filter-head-table/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [userBuyOrderMixin, pendingOrdersMixin],
  data () {
    return {
      POST_TYPE
    };
  },
  created () {
    this.$pendingOrdersMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 600)
    })
  },
  methods: {
    ...mapActions('end-user', [
      'setBuyInfo'
    ]),
    goDetail (order) {
      this.setBuyInfo(order)
      this.$_userBuyOrderMixin_fetchDataBuyInfo(true)
    },
    onShowOrderDetail (order) {
      this.setBuyInfo(order)
      this.$_userBuyOrderMixin_fetchDataBuyInfo(true)
    },
    onRowClicked (item) {
      this.onShowOrderDetail(item)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user/orders-management/index.scss" />
