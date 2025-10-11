<template>
  <section>
    <client-only>
      <template #placeholder>
        <div class="my-2 mx-2">
          <order-filter-skeleton-loader />
          <order-filter-skeleton-loader class="my-2" />
          <order-card-skeleton-loader v-for="key in DEFAULT_LOADER" :key="key" />
        </div>
      </template>
      <layout-wrapper>
        <template #head>
          <tabs-action
            :key="totalPendingOrders"
            :tabs="tabsMapped"
            :active-tab="activeTab"
            @on-change-tab="onChangeUserOrder"
          />
        </template>
        <template #body>
          <div class="order-management">
            <component
              :is="activatedComponent"
              @update-total-pending="updateTotalPendingOrder"
              @on-open-bank-qrcode="$commonOrdersMixin_onOpenBankQrcode"
            />
          </div>
        </template>
      </layout-wrapper>
    </client-only>
    <modal-result-transaction />
    <modal-confirm-send-crypto show-countdown-order-detail modal-class="mobile" />
    <modal-confirm-order
      modal-class="mobile"
      @confirm="$commonOrdersMixin_onOpenModalConfirmPaid"
    />
    <modal-payment-confirmation
      :order="orderDetail"
      :time-left="timeLeft"
      modal-class="mobile"
      :loading="orderDetailLoading"
      @submit-confirm-payment="$commonOrdersMixin_onConfirmSent(orderDetail.orderId)"
    />
    <modal-appeal
      :order="orderDetail"
      @on-transfer="$commonOrdersMixin_onOpenModalConfirmTransfer"
      @on-pay="$commonOrdersMixin_onOpenModalSendCrypto"
    />
    <modal-bank-qrcode :qr-code-url="bankQrCode" />
    <modal-send-crypto-confirmation
      :order-info="orderDetail"
      :time-left="timeLeft"
      :status="statusConfirmSendCryptoInfo"
    />
  </section>
</template>
<script>
import { mapState } from 'vuex';
import commonOrdersMixin from '@/mixins/merchant/orders/common';
import tabsListOrderMixin from '~/mixins/merchant-manager/tabs-list-orders'
import modalMixin from '~/mixins/modal'

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    PendingOrders: () => import('~/components/mobile/merchant/orders-management/pending-orders/index.vue'),
    WaitingConfirmationOrders: () => import('~/components/mobile/merchant/orders-management/waiting-confirmation-orders/index.vue'),
    AppealOrders: () => import('~/components/mobile/merchant/orders-management/appeal-orders/index.vue'),
    CompletedOrders: () => import('~/components/mobile/merchant/orders-management/completed-orders/index.vue'),
    CancelledOrders: () => import('~/components/mobile/merchant/orders-management/cancelled-orders/index.vue'),
    OrderCardSkeletonLoader: () => import('~/components/mobile/commons/loader/order/index.vue'),
    OrderFilterSkeletonLoader: () => import('~/components/mobile/commons/loader/filters/index.vue'),
    ModalConfirmSendCrypto: () => import('@/components/desktop/modal/confirmed-send-crypto.vue'),
    ModalConfirmOrder: () => import('@/components/common/modal/modal-confirm-order.vue'),
    ModalResultTransaction: () => import('@/components/desktop/modal/result-send-crypto.vue'),
    ModalPaymentConfirmation: () => import('@/components/common/modal/payment-confirmation.vue'),
    ModalAppeal: () => import('~/components/desktop/merchant/orders-management/modal/appeal/index.vue'),
    ModalBankQrcode: () => import('@/components/common/modal/modal-bank-qrcode.vue'),
    ModalSendCryptoConfirmation: () => import('~/components/common/modal/send-crypto-confirmation.vue')
  },
  mixins: [tabsListOrderMixin, modalMixin, commonOrdersMixin],
  data () {
    return {
      DEFAULT_LOADER: 6
    }
  },
  computed: {
    ...mapState('user', ['user']),
    userType () {
      return this.user?.type || ''
    },
    ...mapState('send-crypto', ['confirmSendCryptoInfo']),
    statusConfirmSendCryptoInfo () {
      return this.confirmSendCryptoInfo?.status || ''
    },
    timeLeft () {
      return this.orderDetail?.timeout
        ? this.$options.filters.convertToMilliseconds(this.orderDetail.timeout) : 0
    }
  },
  methods: {
    updateTotalPendingOrder (total) {
      this.totalPendingOrders = total
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
