<template>
  <order-grid-renderer class="management-order">
    <template #head>
      <order-filter-head @on-filters="$commonOrdersMixin_onFilterOptionsMobile" />
    </template>
    <template #body>
      <list-common
        :loading="orderLoading"
        :items="orders"
        :total="total"
        show-empty
        :reset-list="page === 1"
        @refresh="$waitingConfirmationOrdersMixin_onRefresh"
        @infinite-loading="onInfiniteLoadingOrder"
      >
        <template #default="{ item }">
          <div :key="item.orderId" class="management-order__item">
            <order-card
              :order="item"
              :is-visible-qr-bank-code="item.postType === POST_TYPE.BUY"
              @on-transfer="$commonOrdersMixin_onOpenModalConfirmTransfer"
              @on-pay="$commonOrdersMixin_onOpenModalSendCrypto"
              @on-open-bank-qrcode="$emit('on-open-bank-qrcode', $event)"
              @on-open-detail="$commonOrdersMixin_onOpenDetailModal"
              @on-open-appeal="$commonOrdersMixin_onOpenAppealModalMobile"
              @on-open-chat="$emit('on-open-chat', $event)"
              @time-out="$commonOrderMixin_onTimeOutOrder"
            />
          </div>
        </template>
      </list-common>
      <modal-order-detail
        :order-detail="orderDetail"
        @on-transfer="$commonOrdersMixin_onOpenModalConfirmTransfer"
        @on-pay="$commonOrdersMixin_onOpenModalSendCrypto"
        @on-open-appeal="$commonOrdersMixin_onOpenAppealModalMobile"
      />
    </template>
  </order-grid-renderer>
</template>
<script>
import { ORDER_GROUPS } from '@/resources/order-filters'
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders'
import walletMixin from '~/mixins/open-wallet.js'
import { ORDER_STATUS, POST_TYPE } from '~/config/constant'
import waitingConfirmationOrdersMixin from '~/mixins/merchant/orders/waiting-confirmation'

export default {
  components: {
    OrderCard: () => import('~/components/mobile/merchant/orders-management/card-order/index.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    OrderFilterHead: () => import('~/components/mobile/orders/filters/order-filter.vue'),
    ModalOrderDetail: () => import('~/components/mobile/modal/orders/detail/index.vue'),
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue')
  },
  mixins: [walletMixin, waitingConfirmationOrdersMixin],
  data () {
    return {
      orderGroup: ORDER_GROUPS.WAITING_USER,
      POST_TYPE
    }
  },
  computed: {
    orders () {
      const filterAllOrders = this.orderMapped.filter(item => ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED]
        .includes(item.status))
      return this.filterSpecialAppealCases(filterAllOrders)
    }
  },
  async created () {
    await this.$waitingConfirmationOrdersMixin_onResetFilter()
  },
  methods: {
    async onRefresh () {
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    },
    async onInfiniteLoadingOrder () {
      if (this.orders.length < this.total) {
        this.page = this.page + 1
        await this.$commonOrdersMixin_getListOrders()
      }
    },
    // Function to filter cases same steps but can in 2 groups
    filterSpecialAppealCases (orders) {
      const specialSteps = [BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER_DEAL_TIME, SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME]
      return orders.filter(item => !(item?.appeal?.appealId && specialSteps.includes(item?.step)))
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/orders-management/index.scss">
</style>
