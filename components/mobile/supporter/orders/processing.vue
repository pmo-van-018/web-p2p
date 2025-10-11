<template>
  <order-grid-renderer class="management-order">
    <template #head>
      <order-filter-head @on-filters="$emit('on-filters', $event)" />
    </template>
    <template #body>
      <list-common
        :loading="isLoading"
        :items="ordersMapped"
        :total="total"
        show-empty
        :reset-list="page === 1"
        @refresh="$emit('on-refresh', $event)"
        @infinite-loading="$emit('infinite-loading', $event)"
      >
        <template #default="{ item }">
          <div :key="item.orderId" class="management-order__item">
            <order-card
              :order="{ ...item, supporterView: true, readOnly: false, confirmResolved: true }"
              :is-loading="isLoadingConfirmResolved"
              :is-visible-qr-bank-code="item.postType === POST_TYPE.BUY"
              @on-open-detail="openOrderDetail"
              @on-open-bank-qrcode="$emit('on-open-bank-qrcode', $event)"
              @on-open-appeal="$_supporterMixin_openAppealPopup"
              @on-open-chat="openChatFrameInAppealModal"
              @on-confirmed-processed="resolveAppeal(item.orderId)"
            />
          </div>
        </template>
      </list-common>
      <modal-order-detail
        :order-detail="selectedOrder"
        @on-open-appeal="$_supporterMixin_openAppealPopupFromDetailPopup"
      />
      <modal-appeal
        :id="modalAppeal"
        :order="selectedOrder"
        @on-open-chat="openChatFrameInAppealModal"
      />
      <modal-chat-frame />
      <modal-payment-info-detail :order="selectedOrder" />
    </template>
  </order-grid-renderer>
</template>
<script>
import supporterMixin from '@/mixins/merchant/supporter/orders';
import { mapActions } from 'vuex'
import socketListenerListMixin from '~/mixins/chat/socket-listener-list'

export default {
  components: {
    OrderCard: () => import('~/components/mobile/merchant/orders-management/card-order/index.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    OrderFilterHead: () => import('~/components/mobile/orders/filters/order-filter.vue'),
    ModalOrderDetail: () => import('~/components/mobile/modal/orders/detail/index.vue'),
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue'),
    ModalAppeal: () => import('~/components/desktop/merchant/orders-management/modal/appeal/index.vue'),
    ModalChatFrame: () => import('~/components/mobile/modal/chat/index.vue'),
    ModalPaymentInfoDetail: () => import('~/components/mobile/modal/orders/payment-info/index.vue')
  },
  mixins: [supporterMixin, socketListenerListMixin],
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
  watch: {
    isLoading: {
      async handler (value) {
        if (!value && this.orders?.length) {
          const roomIds = this.ordersMapped?.map(order => order?.roomId).filter(id => id) || []
          if (roomIds.length) {
            await this.getLastMessages(roomIds)
            this.initSocketList(roomIds)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('chat', ['getLastMessages'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/orders-management/index.scss">
</style>
