<template>
  <order-grid-renderer class="management-order">
    <template #head>
      <order-filter-head is-visible-supporter-process @on-filters="$commonOrdersMixin_onFilterOptionsMobile" />
    </template>
    <template #body>
      <list-common
        :loading="orderLoading"
        :items="orders"
        :total="total"
        show-empty
        :reset-list="page === 1"
        @refresh="$pendingOrdersMixin_onRefresh"
        @infinite-loading="$commonOrdersMixin_onInfiniteLoadingOrder"
      >
        <template #default="{ item }">
          <div :key="item.orderId" class="management-order__item">
            <order-card
              :order="item"
              :is-visible-qr-bank-code="item.postType === POST_TYPE.BUY"
              is-visible-supporter-process
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
import { mapActions } from 'vuex'
import walletMixin from '~/mixins/open-wallet.js'
import { POST_TYPE } from '~/config/constant'
import pendingOrdersMixin from '~/mixins/merchant/orders/pending'
import socketListenerListMixin from '~/mixins/chat/socket-listener-list'

export default {
  components: {
    OrderCard: () => import('~/components/mobile/merchant/orders-management/card-order/index.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    OrderFilterHead: () => import('~/components/mobile/orders/filters/order-filter.vue'),
    ModalOrderDetail: () => import('~/components/mobile/modal/orders/detail/index.vue'),
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue')
  },
  mixins: [walletMixin, pendingOrdersMixin, socketListenerListMixin],
  data () {
    return {
      orderGroup: ORDER_GROUPS.WAITING,
      POST_TYPE
    }
  },
  computed: {
    timeLeft () {
      return this.orderDetail?.timeout
        ? this.$options.filters.convertToMilliseconds(this.orderDetail.timeout) : 0
    }
  },
  async created () {
    await this.$pendingOrdersMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 1000)
    })
    if (this.roomIds.length) {
      await this.getLastMessages(this.roomIds)
      this.initSocketList(this.roomIds)
    }
  },
  beforeDestroy () {
    if (this.roomIds.length) {
      this.leaveRoomSocketList(this.roomIds)
    }
    this.resetStateChat()
  },
  methods: {
    ...mapActions('chat', ['getLastMessages', 'resetStateChat']),
    async onRefresh () {
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/orders-management/index.scss">
</style>
