<template>
  <section>
    <client-only>
      <layout-wrapper class="order-wrapper">
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
      <modal-result-transaction />
      <modal-confirm-send-crypto show-countdown-order-detail />
      <modal-confirm-order @confirm="$commonOrdersMixin_onOpenModalConfirmPaid" />
      <modal-appeal
        :id="modalAppealId"
        :order="orderDetail"
        @on-transfer="$commonOrdersMixin_onOpenModalConfirmTransfer"
        @on-pay="$commonOrdersMixin_onOpenModalSendCrypto"
      />
      <modal-payment-confirmation
        :order="orderDetail"
        :time-left="timeLeft"
        :loading="orderDetailLoading"
        @submit-confirm-payment="$commonOrdersMixin_onConfirmSent(orderDetail.orderId)"
      />
      <modal-bank-qrcode :qr-code-url="bankQrCode" />
      <modal-send-crypto-confirmation
        :order-info="orderDetail"
        :time-left="timeLeft"
        :status="statusConfirmSendCryptoInfo"
      />
    </client-only>
  </section>
</template>
<script>
import { mapState } from 'vuex';
import commonOrdersMixin from '@/mixins/merchant/orders/common';
import { MODAL } from '@/resources/modal';
import modalMixin from '~/mixins/modal'
import tabsListOrderMixin from '~/mixins/merchant-manager/tabs-list-orders'

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    PendingOrders: () => import('~/components/desktop/merchant/orders-management/pending-orders/index.vue'),
    WaitingConfirmationOrders: () => import('~/components/desktop/merchant/orders-management/waiting-confirmation-orders/index.vue'),
    AppealOrders: () => import('~/components/desktop/merchant/orders-management/appeal-orders/index.vue'),
    CompletedOrders: () => import('~/components/desktop/merchant/orders-management/completed-orders/index.vue'),
    CancelledOrders: () => import('~/components/desktop/merchant/orders-management/cancelled-orders/index.vue'),
    ModalConfirmSendCrypto: () => import('@/components/desktop/modal/confirmed-send-crypto.vue'),
    ModalAppeal: () => import('~/components/desktop/merchant/orders-management/modal/appeal/index.vue'),
    ModalConfirmOrder: () => import('@/components/common/modal/modal-confirm-order.vue'),
    ModalPaymentConfirmation: () => import('@/components/common/modal/payment-confirmation.vue'),
    ModalBankQrcode: () => import('@/components/common/modal/modal-bank-qrcode.vue'),
    ModalSendCryptoConfirmation: () => import('~/components/common/modal/send-crypto-confirmation.vue'),
    ModalResultTransaction: () => import('@/components/desktop/modal/result-send-crypto.vue')
  },
  mixins: [tabsListOrderMixin, modalMixin, commonOrdersMixin],
  data () {
    return {
      modalAppealId: MODAL.MERCHANT_APPEAL
    }
  },
  computed: {
    ...mapState({
      currentOrder: state => state.orders.order
    }),
    ...mapState('user', ['user']),
    ...mapState('send-crypto', ['confirmSendCryptoInfo']),
    userType () {
      return this.user?.type || ''
    },
    tabsMapped () {
      return this.tabs.map((tab) => {
        if (tab.status === 'pending' || tab.status === 'pending-progress') {
          return { ...tab, count: this.totalPendingOrders };
        }
        return tab
      })
    },
    statusConfirmSendCryptoInfo () {
      return this.confirmSendCryptoInfo?.status || ''
    },
    timeLeft () {
      return this.orderDetail.timeout
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
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/orders/list/index.scss">
</style>
